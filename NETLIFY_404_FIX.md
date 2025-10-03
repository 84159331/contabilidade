# Netlify Functions - Troubleshooting 404

## 🚨 Problema: Erro 404 nas Netlify Functions

### ✅ Soluções:

#### 1. **Verificar Configuração do Netlify**
No painel do Netlify:
- **Build command**: `npm install && cd client && npm install && npm run build && cd ../netlify/functions && npm install`
- **Publish directory**: `client/build`
- **Functions directory**: `netlify/functions`

#### 2. **Variáveis de Ambiente**
Certifique-se de que estão configuradas:
```
JWT_SECRET=sua-chave-secreta-super-segura-aqui-2024
NODE_VERSION=20
CI=false
```

#### 3. **Estrutura de Pastas**
Verifique se está assim:
```
netlify/
  functions/
    auth/
      login.js
      verify.js
    health.js
    package.json
```

#### 4. **Deploy Manual**
Se o deploy automático não funcionar:
1. Acesse o Netlify
2. Vá em **"Deploys"**
3. Clique em **"Trigger deploy"**
4. Selecione **"Deploy site"**

#### 5. **Verificar Logs**
No Netlify:
1. Vá em **"Functions"**
2. Clique na function `auth/login`
3. Verifique os logs de erro

#### 6. **Testar Function**
Após o deploy, teste:
- `https://seu-site.netlify.app/.netlify/functions/health`
- Deve retornar: `{"status":"OK"}`

### 🔧 **Se ainda não funcionar:**

#### **Opção A: Deploy Manual das Functions**
1. Instale o Netlify CLI: `npm install -g netlify-cli`
2. Execute: `netlify deploy --prod`

#### **Opção B: Usar Vercel**
Se o Netlify continuar com problemas:
1. Configure o Vercel para o backend
2. Use as URLs do Vercel no frontend

### 🎯 **URLs das Functions:**
- **Login**: `/.netlify/functions/auth-login`
- **Verify**: `/.netlify/functions/auth-verify`
- **Health**: `/.netlify/functions/health`

### 💡 **Dicas:**
- Aguarde 2-3 minutos após o deploy
- Limpe o cache do browser
- Verifique se as dependências foram instaladas
- Teste primeiro a function `health`
