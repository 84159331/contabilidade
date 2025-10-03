#!/bin/bash

# 🚀 Script de Configuração de Deploy Automático
# Este script ajuda a configurar o deploy automático

echo "🚀 Configurando Deploy Automático..."
echo "=================================="

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

echo "✅ Projeto encontrado!"

# Verificar se o Git está configurado
if [ ! -d ".git" ]; then
    echo "❌ Erro: Este não é um repositório Git"
    echo "Execute: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Repositório Git encontrado!"

# Verificar se o GitHub Actions está configurado
if [ ! -d ".github/workflows" ]; then
    echo "❌ Erro: GitHub Actions não configurado"
    exit 1
fi

echo "✅ GitHub Actions configurado!"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependências do cliente..."
    cd client && npm install && cd ..
fi

echo "✅ Dependências instaladas!"

# Testar build
echo "🔨 Testando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build bem-sucedido!"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi

echo ""
echo "🎉 Configuração básica concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure os secrets no GitHub:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID" 
echo "   - VERCEL_PROJECT_ID"
echo "   - NETLIFY_AUTH_TOKEN"
echo "   - NETLIFY_SITE_ID"
echo ""
echo "2. Faça push para o GitHub:"
echo "   git add ."
echo "   git commit -m 'Configure deploy automático'"
echo "   git push origin main"
echo ""
echo "3. Configure as plataformas de hospedagem:"
echo "   - Vercel: https://vercel.com"
echo "   - Netlify: https://netlify.com"
echo ""
echo "📖 Consulte DEPLOY_SETUP.md para instruções detalhadas"
