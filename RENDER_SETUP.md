# Render Configuration

## Deploy do Backend no Render

### Passo a Passo Detalhado:

#### 1. Acesse Render
- Vá em https://render.com
- Faça login com sua conta GitHub

#### 2. Criar Web Service
- Clique em **"New"** → **"Web Service"**
- Conecte seu repositório `contabilidade`

#### 3. Configurar Deploy
- **Name**: `contabilidade-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`
- **Root Directory**: deixe vazio (raiz do projeto)

#### 4. Variáveis de Ambiente
Adicione estas variáveis no Render:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui-2024
PORT=5001
```

#### 5. Deploy
- Clique em **"Create Web Service"**
- Aguarde o deploy (5-10 minutos)
- Anote a URL gerada (ex: `https://contabilidade-backend.onrender.com`)

#### 6. Atualizar Frontend
No Netlify:
- Vá em **Site Settings** → **Environment Variables**
- Adicione: `REACT_APP_API_URL` = `https://contabilidade-backend.onrender.com/api`

#### 7. Redeploy do Frontend
- No Netlify, vá em **"Deploys"**
- Clique em **"Trigger deploy"** → **"Deploy site"**

#### 8. Teste Final
- API Health: `https://contabilidade-backend.onrender.com/api/health`
- Deve retornar: `{"status":"OK"}`
- Login: `https://kaleidoscopic-arithmetic-e795e1.netlify.app/tesouraria/login`
- Credenciais: `admin` / `admin123`

### Vantagens do Render:
- ✅ Mais confiável que Railway
- ✅ Deploy automático
- ✅ Logs claros
- ✅ CORS funciona corretamente
- ✅ Configuração simples
- ✅ Suporte gratuito generoso

### Troubleshooting:
Se houver problemas:
1. Verifique os logs no Render
2. Confirme se as variáveis de ambiente estão corretas
3. Verifique se o Start Command está correto: `node server/index.js`
