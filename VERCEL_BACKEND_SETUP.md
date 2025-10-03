# Vercel Backend - Configuração Gratuita

## Por que Vercel é melhor que Railway:

### ✅ Vantagens:
- **100% gratuito** para projetos pessoais
- **Deploy automático** do GitHub
- **Muito rápido** (30 segundos)
- **CORS funciona** perfeitamente
- **Logs claros** para debug
- **Configuração simples**
- **Sempre estável**

### 🚀 Como configurar:

#### 1. Acesse Vercel
- Vá em https://vercel.com
- Faça login com GitHub

#### 2. Criar Projeto
- Clique em **"New Project"**
- Selecione seu repositório `contabilidade`
- **IMPORTANTE**: Configure como **"Backend"** ou **"API"**

#### 3. Configurar Deploy
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Output Directory**: `.`
- **Install Command**: `npm install`

#### 4. Variáveis de Ambiente
Adicione no Vercel:
```
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=5001
```

#### 5. Deploy
- Vercel fará deploy automaticamente
- Aguarde 30 segundos
- Anote a URL gerada

#### 6. Teste
- `https://seu-projeto.vercel.app/api/health`
- Deve retornar: `{"status":"OK"}`

### 📋 Configuração já pronta:
- ✅ `server/package.json` criado
- ✅ CORS configurado para produção
- ✅ Banco de dados SQLite funcionando
- ✅ Estrutura correta para Vercel

### 💰 Custo:
- **Gratuito**: Sem limites para projetos pessoais
- **Sempre ativo**: Nunca dorme
- **Sem restrições**: Uso ilimitado

### 🎯 Próximo passo:
Após o deploy no Vercel, atualize o Netlify:
- `REACT_APP_API_URL` = `https://seu-projeto.vercel.app/api`

**Vercel é muito mais confiável que Railway!** 🚀
