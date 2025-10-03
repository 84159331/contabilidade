# Railway Configuration

## Deploy do Backend no Railway

### Passo 1: Criar conta no Railway
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

### Passo 2: Conectar repositório
1. Selecione "Deploy from GitHub repo"
2. Escolha seu repositório `contabilidade`
3. Railway detectará automaticamente que é um projeto Node.js

### Passo 3: Configurar variáveis de ambiente
No painel do Railway, vá em Variables e adicione:

```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=5001
```

### Passo 4: Deploy automático
- Railway fará deploy automaticamente
- Aguarde alguns minutos
- Anote a URL gerada (ex: `https://contabilidade-production.up.railway.app`)

### Passo 5: Atualizar frontend
No Netlify, vá em Site Settings → Environment Variables e adicione:

```
REACT_APP_API_URL=https://sua-url-do-railway.up.railway.app/api
```

## Alternativa: Render

Se preferir Render:

### Passo 1: Criar conta no Render
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub

### Passo 2: Criar Web Service
1. Clique em "New" → "Web Service"
2. Conecte seu repositório
3. Configure:
   - **Name**: `contabilidade-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`

### Passo 3: Variáveis de ambiente
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
```

### Passo 4: Deploy
- Render fará deploy automaticamente
- URL será algo como: `https://contabilidade-backend.onrender.com`

## Teste Final

Após o deploy:
1. Acesse sua URL do backend + `/api/health`
2. Deve retornar: `{"status":"OK"}`
3. Teste o login no frontend

## Credenciais de Login

```
👤 Username: admin
🔑 Senha: admin123
```
