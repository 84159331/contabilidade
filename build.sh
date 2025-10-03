#!/bin/bash

# Script de build para Netlify
echo "🚀 Iniciando build..."

# Instalar dependências da raiz
echo "📦 Instalando dependências da raiz..."
npm install

# Instalar dependências do client
echo "📦 Instalando dependências do client..."
cd client
npm install

# Build do client
echo "🔨 Fazendo build do client..."
npm run build

# Voltar para raiz
cd ..

# Instalar dependências das functions
echo "📦 Instalando dependências das functions..."
cd netlify/functions
npm install

# Voltar para raiz
cd ../..

echo "✅ Build concluído!"
