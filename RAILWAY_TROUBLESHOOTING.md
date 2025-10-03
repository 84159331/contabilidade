# Railway Configuration

## Deploy do Backend no Railway

### Problema Atual:
O backend no Railway não tem a configuração de CORS atualizada.

### Solução:

#### 1. Verificar se o Railway está conectado ao repositório correto:
- Acesse https://railway.app
- Vá no seu projeto
- Verifique se está conectado ao branch `main`
- Verifique se está fazendo deploy da pasta `server/`

#### 2. Configurar variáveis de ambiente no Railway:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=5001
```

#### 3. Forçar redeploy:
- No Railway, vá em "Deployments"
- Clique em "Redeploy" ou "Deploy"
- Aguarde o deploy completar (5-10 minutos)

#### 4. Verificar se o CORS está funcionando:
Teste a URL: `https://contabilidade-backend-production.up.railway.app/api/health`

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "2024-10-03T...",
  "version": "1.0.0"
}
```

#### 5. Se ainda não funcionar, verificar logs:
- No Railway, vá em "Logs"
- Procure por erros relacionados a CORS
- Verifique se o servidor está iniciando corretamente

### Configuração Alternativa:

Se o Railway não estiver funcionando, podemos usar Render:

#### 1. Acesse https://render.com
#### 2. Crie novo Web Service
#### 3. Conecte com GitHub
#### 4. Configure:
- **Name**: `contabilidade-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run server`
- **Root Directory**: `server`

#### 5. Variáveis de ambiente:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
```

### Teste Final:
Após o deploy, teste:
1. `https://sua-url/api/health` - deve retornar OK
2. Login no frontend - deve funcionar sem erro de CORS
