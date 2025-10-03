#!/bin/bash

# 🚀 Script para Deploy do Backend
# Este script ajuda a preparar o projeto para deploy

echo "🚀 Preparando projeto para deploy do backend..."
echo "============================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

echo "✅ Projeto encontrado!"

# Verificar se o banco de dados existe
if [ ! -f "database/igreja.db" ]; then
    echo "📦 Configurando banco de dados..."
    node server/setup-database.js
fi

echo "✅ Banco de dados configurado!"

# Verificar se as dependências estão instaladas
if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependências do servidor..."
    cd server && npm install && cd ..
fi

echo "✅ Dependências instaladas!"

# Testar se o servidor funciona
echo "🔧 Testando servidor..."
timeout 10s npm run server &
SERVER_PID=$!
sleep 3

# Verificar se o servidor está rodando
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Servidor funcionando!"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Erro: Servidor não está funcionando"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse https://railway.app"
echo "2. Faça login com GitHub"
echo "3. Clique em 'New Project'"
echo "4. Selecione 'Deploy from GitHub repo'"
echo "5. Escolha este repositório"
echo "6. Configure as variáveis de ambiente:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=sua-chave-secreta-super-segura"
echo "7. Aguarde o deploy (5-10 minutos)"
echo "8. Anote a URL gerada"
echo "9. No Netlify, adicione a variável:"
echo "   REACT_APP_API_URL=https://sua-url-do-railway.up.railway.app/api"
echo ""
echo "📖 Consulte RAILWAY_DEPLOY.md para instruções detalhadas"
