import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const TOPIC_DEVOTIONALS = 'devotionals';

function getSaoPauloDateId(now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return fmt.format(now);
}

async function generateDevotionalViaGemini(dateId: string) {
  const apiKey = String(GEMINI_API_KEY.value() || process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const prompt =
    `Gere um devocional cristão em português do Brasil para a data ${dateId}.\n` +
    `Requisitos obrigatórios:\n` +
    `- Tema livre, variado, bem elaborado, objetivo e reflexivo\n` +
    `- 1 título\n` +
    `- 1 versículo (referência + texto do versículo)\n` +
    `- Corpo do estudo com exatamente 4 parágrafos, concisos e coesos\n` +
    `- Uma seção de aplicação prática com 3 a 5 itens curtos\n` +
    `- Finalizar com uma oração curta OU uma frase de impacto para ânimo do dia a dia\n` +
    `\n` +
    `Retorne APENAS um JSON válido (sem markdown) com o seguinte formato:\n` +
    `{"title":"...","verseRef":"...","verseText":"...","bodyParagraphs":["p1","p2","p3","p4"],"application":["item1","item2"],"closing":"..."}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 900,
      },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini API error: ${resp.status} ${resp.statusText} - ${text}`);
  }

  const json = (await resp.json()) as any;
  const text = String(json?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
  if (!text) {
    throw new Error('Gemini retornou resposta vazia');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match?.[0]) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error('Não foi possível parsear JSON do Gemini');
    }
  }

  const title = String(parsed?.title || '').trim();
  const verseRef = String(parsed?.verseRef || '').trim();
  const verseText = String(parsed?.verseText || '').trim();
  const bodyParagraphs: string[] = Array.isArray(parsed?.bodyParagraphs) ? parsed.bodyParagraphs.map((p: any) => String(p || '').trim()).filter(Boolean) : [];
  const application: string[] = Array.isArray(parsed?.application) ? parsed.application.map((p: any) => String(p || '').trim()).filter(Boolean) : [];
  const closing = String(parsed?.closing || '').trim();

  if (!title || !verseRef || !verseText || bodyParagraphs.length !== 4) {
    throw new Error('JSON do Gemini veio incompleto (title/verse/bodyParagraphs)');
  }

  const body =
    `${bodyParagraphs.join('\n\n')}\n\n` +
    `Aplicação na prática:\n` +
    `${application.length ? application.map((i) => `- ${i}`).join('\n') : '- Reflita e aplique hoje mesmo.'}\n\n` +
    `${closing || ''}`.trim();

  return {
    title,
    verseRef,
    verseText,
    body,
  };
}

export const generateDailyDevotional = functions
  .runWith({ secrets: [GEMINI_API_KEY] })
  .pubsub
  .schedule('10 5 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => {
    const db = admin.firestore();
    const dateId = getSaoPauloDateId();

    const ref = db.collection('devotionals').doc(dateId);
    const existing = await ref.get();

    if (existing.exists) {
      console.log(`Devocional já existe para ${dateId}. Pulando...`);
      return null;
    }

    try {
      const generated = await generateDevotionalViaGemini(dateId);

      await ref.set({
        date: dateId,
        title: generated.title,
        verseRef: generated.verseRef,
        verseText: generated.verseText,
        body: generated.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'system:gemini',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'system:gemini',
      });

      await db.collection('devotionals_generation_logs').add({
        date: dateId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'success',
        source: 'schedule',
      });

      console.log(`Devocional gerado e salvo: ${dateId}`);
      return null;
    } catch (error) {
      console.error(`Erro ao gerar devocional (${dateId}):`, error);

      await db.collection('devotionals_generation_logs').add({
        date: dateId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'error',
        error: String((error as any)?.message || error),
        source: 'schedule',
      });

      return null;
    }
  });

export const onDevotionalCreatedSendNotification = functions.firestore
  .document('devotionals/{dateId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const dateId = String(context.params.dateId || '').trim();
    const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : 'Devocional Diário';
    const verseRef = typeof data.verseRef === 'string' ? data.verseRef.trim() : '';

    const body = verseRef ? `${verseRef}` : 'Abra o app e leia o devocional de hoje.';

    try {
      const message: admin.messaging.Message = {
        topic: TOPIC_DEVOTIONALS,
        notification: {
          title: `Devocional de hoje: ${title}`,
          body,
        },
        data: {
          type: 'devotional',
          date: dateId,
        },
        webpush: {
          fcmOptions: {
            link: '/devocional',
          },
        },
      };

      const res = await admin.messaging().send(message);
      console.log('Push de devocional enviado:', res);
      return null;
    } catch (error) {
      console.error('Erro ao enviar push de devocional:', error);
      try {
        await admin.firestore().collection('devotionals_push_logs').add({
          date: dateId,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'error',
          error: String((error as any)?.message || error),
        });
      } catch {
        // ignore
      }
      return null;
    }
  });
