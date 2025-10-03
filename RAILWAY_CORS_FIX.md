# Railway Deploy Configuration

## Problema Atual:
O Railway não está usando a versão mais recente do código com CORS configurado.

## Soluções:

### 1. Verificar Configuração do Railway:
1. Acesse https://railway.app
2. Vá no seu projeto `contabilidade-backend-production`
3. Verifique se está conectado ao repositório correto
4. Verifique se está fazendo deploy da pasta `server/`

### 2. Forçar Redeploy:
1. No Railway, vá em **"Deployments"**
2. Clique em **"Redeploy"** ou **"Deploy"**
3. Aguarde o deploy completar (5-10 minutos)

### 3. Verificar Logs:
1. No Railway, vá em **"Logs"**
2. Procure por mensagens como:
   - "Servidor rodando na porta"
   - "Conectado ao banco de dados"
   - Erros de CORS

### 4. Verificar Variáveis de Ambiente:
No Railway, vá em **"Variables"** e confirme:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=5001
```

### 5. Testar API:
Após o redeploy, teste:
- `https://contabilidade-backend-production.up.railway.app/api/health`
- Deve retornar: `{"status":"OK"}`

### 6. Se ainda não funcionar:
1. Delete o projeto no Railway
2. Crie um novo projeto
3. Conecte com GitHub
4. Configure para fazer deploy da pasta `server/`

## Configuração Alternativa - Render:

Se o Railway continuar com problemas, use Render:

### 1. Acesse https://render.com
### 2. Crie novo Web Service
### 3. Configure:
- **Name**: `contabilidade-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Root Directory**: `server`

### 4. Variáveis de ambiente:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
```

### 5. Após deploy no Render:
Atualize no Netlify:
- Site Settings → Environment Variables
- `REACT_APP_API_URL` = `https://contabilidade-backend.onrender.com/api`

## Teste Final:
Após qualquer uma das soluções:
1. Teste: `https://sua-url/api/health`
2. Teste login no frontend
3. Deve funcionar sem erro de CORS
