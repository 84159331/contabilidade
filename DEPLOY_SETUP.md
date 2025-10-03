# 🚀 Guia de Deploy Automático

## Configuração Completa para Hospedagem Gratuita

Este projeto está configurado para deploy automático em múltiplas plataformas gratuitas.

### 📋 Plataformas Configuradas

1. **Vercel** (Recomendado)
2. **Netlify** (Alternativa)
3. **GitHub Pages** (Backup)

---

## 🔧 Configuração do Vercel (Recomendado)

### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Importe seu repositório

### Passo 2: Configurar variáveis de ambiente
No painel do Vercel, adicione:
```
REACT_APP_API_URL=https://seu-backend.vercel.app
```

### Passo 3: Configurar secrets no GitHub
No seu repositório GitHub:
1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione os seguintes secrets:

```
VERCEL_TOKEN=seu_token_do_vercel
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

**Como obter os tokens:**
- `VERCEL_TOKEN`: Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`: Vercel Dashboard → Project Settings

---

## 🌐 Configuração do Netlify

### Passo 1: Criar conta no Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Faça login com sua conta GitHub
3. Importe seu repositório

### Passo 2: Configurar build settings
- **Build command**: `npm install && cd client && npm install && npm run build`
- **Publish directory**: `client/build`

### Passo 3: Configurar secrets no GitHub
Adicione no GitHub Secrets:
```
NETLIFY_AUTH_TOKEN=seu_token_do_netlify
NETLIFY_SITE_ID=seu_site_id
```

**Como obter os tokens:**
- `NETLIFY_AUTH_TOKEN`: Netlify Dashboard → User Settings → Applications
- `NETLIFY_SITE_ID`: Netlify Dashboard → Site Settings → General

---

## ⚡ Deploy Automático

### Como funciona:
1. **Push para main**: Deploy automático em todas as plataformas
2. **Pull Request**: Preview automático
3. **Manual**: Execute via GitHub Actions

### Comandos úteis:
```bash
# Deploy manual via GitHub Actions
# Vá em Actions → Deploy Automático → Run workflow

# Build local para teste
npm run build

# Desenvolvimento local
npm run dev
```

---

## 🔍 Monitoramento

### Status dos deploys:
- **GitHub Actions**: Verifique em Actions tab
- **Vercel**: Dashboard do Vercel
- **Netlify**: Dashboard do Netlify

### URLs de produção:
- Vercel: `https://seu-projeto.vercel.app`
- Netlify: `https://seu-projeto.netlify.app`

---

## 🛠️ Troubleshooting

### Problemas comuns:

1. **Build falha**:
   - Verifique se todas as dependências estão instaladas
   - Confirme se as variáveis de ambiente estão corretas

2. **Deploy não funciona**:
   - Verifique se os secrets estão configurados
   - Confirme se os tokens não expiraram

3. **Site não carrega**:
   - Verifique se a URL da API está correta
   - Confirme se o backend está funcionando

### Logs importantes:
- GitHub Actions logs
- Vercel/Netlify build logs
- Console do navegador

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs de deploy
2. Consulte a documentação das plataformas
3. Abra uma issue no repositório

---

## 🎯 Próximos Passos

Após configurar:
1. ✅ Teste o deploy automático
2. ✅ Configure domínio personalizado (opcional)
3. ✅ Configure monitoramento
4. ✅ Configure backup automático
