# Railway - Alternativa Gratuita

## Por que Railway é a melhor opção:

### ✅ Vantagens:
- **$5 de crédito gratuito/mês** (suficiente para seu projeto)
- **Deploy automático** do GitHub
- **Muito rápido** (2-3 minutos)
- **CORS funciona** perfeitamente
- **Logs claros** para debug
- **Configuração simples**

### 🚀 Como configurar:

#### 1. Acesse Railway
- Vá em https://railway.app
- Faça login com GitHub

#### 2. Criar Projeto
- Clique em **"New Project"**
- Selecione **"Deploy from GitHub repo"**
- Escolha seu repositório `contabilidade`

#### 3. Configurar Deploy
- Railway detectará automaticamente que é Node.js
- Configure as variáveis de ambiente:
  ```
  NODE_ENV=production
  JWT_SECRET=sua-chave-secreta-super-segura-aqui
  PORT=5001
  ```

#### 4. Deploy
- Railway fará deploy automaticamente
- Aguarde 2-3 minutos
- Anote a URL gerada

#### 5. Teste
- `https://seu-projeto.up.railway.app/api/health`
- Deve retornar: `{"status":"OK"}`

### 📋 Configuração já pronta:
- ✅ `railway.json` configurado
- ✅ `server/package.json` criado
- ✅ CORS configurado para produção
- ✅ Banco de dados SQLite funcionando

### 💰 Custo:
- **Gratuito**: $5 de crédito/mês
- **Seu projeto**: ~$1-2/mês
- **Sobra**: $3-4/mês para outros projetos

### 🎯 Próximo passo:
Após o deploy no Railway, atualize o Netlify:
- `REACT_APP_API_URL` = `https://seu-projeto.up.railway.app/api`
