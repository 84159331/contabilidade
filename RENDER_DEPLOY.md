# Render Configuration

## Deploy do Backend no Render

### Passo a Passo:

#### 1. Acesse Render
- Vá em https://render.com
- Faça login com GitHub

#### 2. Criar Web Service
- Clique em "New" → "Web Service"
- Conecte seu repositório `contabilidade`

#### 3. Configurar Deploy
- **Name**: `contabilidade-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server/index.js`
- **Root Directory**: deixe vazio (raiz do projeto)

#### 4. Variáveis de Ambiente
Adicione estas variáveis:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=5001
```

#### 5. Deploy
- Clique em "Create Web Service"
- Aguarde o deploy (5-10 minutos)
- Anote a URL gerada (ex: `https://contabilidade-backend.onrender.com`)

#### 6. Atualizar Frontend
No Netlify:
- Site Settings → Environment Variables
- `REACT_APP_API_URL` = `https://contabilidade-backend.onrender.com/api`

#### 7. Teste
- `https://contabilidade-backend.onrender.com/api/health`
- Deve retornar: `{"status":"OK"}`
- Login no frontend deve funcionar

### Vantagens do Render:
- ✅ Mais confiável que Railway
- ✅ Deploy automático
- ✅ Logs claros
- ✅ Configuração simples
- ✅ CORS funciona corretamente
