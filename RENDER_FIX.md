# Render Configuration - Correção

## Problema Identificado:
O Render está tentando executar `node server/index.js` como um arquivo único.

## Soluções:

### Solução 1: Corrigir Start Command
No Render Dashboard:
1. Vá em **Settings** do seu serviço
2. Procure por **"Start Command"**
3. Altere para: `npm run server`
4. Salve e faça redeploy

### Solução 2: Configuração Alternativa
- **Build Command**: `npm install`
- **Start Command**: `npm run server`

### Solução 3: Comando Direto
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`

## Verificação:
Após corrigir, o deploy deve funcionar e você verá:
- Build successful
- Server running on port 5001
- API health check passing

## Teste Final:
Após o deploy funcionar:
- `https://seu-servico.onrender.com/api/health`
- Deve retornar: `{"status":"OK"}`
