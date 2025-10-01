# 🌐 CONFIGURAÇÃO DE IPs E DOMÍNIOS PARA RENDER

## 📋 **IPs FORNECIDOS**

```
44.229.227.142
54.188.71.94
52.13.128.108
74.220.48.0/24
74.220.56.0/24
```

## 🔍 **ANÁLISE DOS IPs**

### **IPs Individuais**
- `44.229.227.142` - Provavelmente IP do Render
- `54.188.71.94` - Provavelmente IP do Render
- `52.13.128.108` - Provavelmente IP do Render

### **Redes CIDR**
- `74.220.48.0/24` - Rede do Render (256 IPs)
- `74.220.56.0/24` - Rede do Render (256 IPs)

## 🚀 **CONFIGURAÇÃO PARA DEPLOY**

### **1. Deploy do Frontend (Static Site)**

1. **Acesse** [render.com](https://render.com)
2. **Clique** em "New" → "Static Site"
3. **Conecte** ao GitHub
4. **Configure**:
   - **Name**: `igreja-contabilidade-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Node Version**: `18.x`

5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://igreja-contabilidade-backend.onrender.com
   NODE_ENV=production
   ```

### **2. Deploy do Backend (Web Service)**

1. **Clique** em "New" → "Web Service"
2. **Conecte** ao GitHub
3. **Configure**:
   - **Name**: `igreja-contabilidade-backend`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18.x`

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://...
   ```

## 🔧 **CONFIGURAÇÕES ESPECÍFICAS**

### **CORS Configuration (Backend)**

Se você precisar configurar CORS para aceitar apenas esses IPs:

```javascript
// server/index.js
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://igreja-contabilidade-frontend.onrender.com',
    'http://localhost:3000', // Para desenvolvimento
    // Adicione outros domínios se necessário
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### **Firewall Rules (Se Necessário)**

Se você precisar configurar firewall para aceitar apenas esses IPs:

```javascript
// Middleware de IP Whitelist
const allowedIPs = [
  '44.229.227.142',
  '54.188.71.94',
  '52.13.128.108',
  '74.220.48.0/24',
  '74.220.56.0/24'
];

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Verificar se o IP está na whitelist
  if (isIPAllowed(clientIP, allowedIPs)) {
    next();
  } else {
    res.status(403).json({ error: 'IP não autorizado' });
  }
});
```

## 🌐 **DOMÍNIOS ESPERADOS**

Após o deploy, você terá:

- **Frontend**: `https://igreja-contabilidade-frontend.onrender.com`
- **Backend**: `https://igreja-contabilidade-backend.onrender.com`

## 📊 **VERIFICAÇÃO DO DEPLOY**

### **1. Teste do Frontend**
```bash
curl https://igreja-contabilidade-frontend.onrender.com
```

### **2. Teste do Backend**
```bash
curl https://igreja-contabilidade-backend.onrender.com/api/health
```

### **3. Teste de Conectividade**
```bash
# Teste se o frontend consegue acessar o backend
curl -H "Origin: https://igreja-contabilidade-frontend.onrender.com" \
     https://igreja-contabilidade-backend.onrender.com/api/health
```

## 🔒 **CONFIGURAÇÕES DE SEGURANÇA**

### **1. HTTPS Automático**
- ✅ Render fornece HTTPS automático
- ✅ Certificados SSL válidos
- ✅ Redirecionamento HTTP → HTTPS

### **2. Headers de Segurança**
```javascript
// Adicionar headers de segurança
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## 🎯 **PRÓXIMOS PASSOS**

1. **Faça commit** das alterações:
```bash
git add .
git commit -m "Config: Preparar para deploy no Render"
git push origin main
```

2. **Configure** os deploys no Render:
   - Frontend como Static Site
   - Backend como Web Service

3. **Teste** a conectividade entre frontend e backend

4. **Configure** variáveis de ambiente

## 💡 **DICAS IMPORTANTES**

- **IPs do Render**: Os IPs fornecidos são provavelmente do Render
- **CORS**: Configure CORS para aceitar o domínio do frontend
- **HTTPS**: Use sempre HTTPS em produção
- **Environment Variables**: Configure as URLs corretas

## 🎊 **RESULTADO FINAL**

Após o deploy:
- ✅ **Frontend**: Hospedado no Render
- ✅ **Backend**: Hospedado no Render
- ✅ **SSL**: Automático
- ✅ **Deploy**: Automático via GitHub
- ✅ **Performance**: Otimizada

**Agora está tudo pronto para o deploy no Render!** 🚀
