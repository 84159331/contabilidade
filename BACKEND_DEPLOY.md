# 🚀 Guia de Deploy do Backend

## Problema Resolvido: CORS

O erro de CORS foi corrigido! O servidor agora aceita requisições de:
- `http://localhost:3000` (desenvolvimento)
- `https://kaleidoscopic-arithmetic-e795e1.netlify.app` (seu site Netlify)
- `https://*.netlify.app` (qualquer site Netlify)
- `https://*.vercel.app` (qualquer site Vercel)

## 🔧 Como Deployar o Backend

### Opção 1: Railway (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. Conecte com GitHub
3. Importe o repositório
4. Configure as variáveis de ambiente:
   ```
   NODE_ENV=production
   JWT_SECRET=seu-jwt-secret-aqui
   PORT=5001
   ```

### Opção 2: Render
1. Acesse [render.com](https://render.com)
2. Conecte com GitHub
3. Crie novo Web Service
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Environment**: `Node`

### Opção 3: Heroku
1. Acesse [heroku.com](https://heroku.com)
2. Crie nova app
3. Conecte com GitHub
4. Configure variáveis de ambiente

## 📋 Variáveis de Ambiente Necessárias

```env
NODE_ENV=production
JWT_SECRET=seu-jwt-secret-super-seguro
PORT=5001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000
```

## 🔗 Atualizar Frontend

Após fazer deploy do backend, atualize a URL no frontend:

### Netlify:
- Site Settings → Environment Variables
- `REACT_APP_API_URL` = `https://seu-backend.railway.app/api`

### Vercel:
- Project Settings → Environment Variables
- `REACT_APP_API_URL` = `https://seu-backend.railway.app/api`

## ✅ Teste de Funcionamento

1. **Backend funcionando**: ✅
2. **CORS configurado**: ✅
3. **Login testado**: ✅

## 🎯 Próximos Passos

1. Faça deploy do backend em Railway/Render/Heroku
2. Atualize a URL da API no frontend
3. Teste o login em produção

## 📞 Credenciais de Login

```
👤 Username: admin
🔑 Senha: admin123
```

O sistema está pronto para produção! 🚀
