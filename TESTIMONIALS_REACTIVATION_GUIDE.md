# Seção "Histórias de Transformação" - Temporariamente Desabilitada

## 📝 **Status:** 
- ✅ **Desabilitada temporariamente** na página principal
- 🔄 **Pronta para reativação** quando necessário

## 🔧 **Como reativar:**

### **1. Na HomePage (`client/src/pages/public/HomePage.tsx`):**

**A) Descomentar a constante testimonials (linha ~85):**
```javascript
// Remover os comentários /* e */ ao redor da constante testimonials
const testimonials = [
  {
    name: "Maria Silva",
    age: 35,
    location: "São Paulo, SP",
    story: "Encontrei na Comunidade Cristã Resgate um lugar onde posso crescer espiritualmente e servir ao próximo. A mensagem de esperança transformou minha vida completamente.",
    image: "/img/testimonial-1.jpg",
    rating: 5
  },
  // ... outros testemunhos
];
```

**B) Descomentar a seção de renderização (linha ~459):**
```javascript
// Remover os comentários /* e */ ao redor da div da seção
<div className="py-16 bg-white dark:bg-gray-800">
  <div className="container mx-auto px-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Histórias de Transformação</h2>
      <p className="text-gray-600 dark:text-gray-300">Veja como Deus tem transformado vidas em nossa comunidade</p>
    </div>
    // ... resto da seção
  </div>
</div>
```

## 📋 **Dados dos testemunhos:**

### **Testemunho 1:**
- **Nome:** Maria Silva
- **Idade:** 35 anos
- **Localização:** São Paulo, SP
- **História:** Foco no crescimento espiritual e serviço

### **Testemunho 2:**
- **Nome:** João Santos
- **Idade:** 28 anos
- **Localização:** Rio de Janeiro, RJ
- **História:** Estudos bíblicos e comunhão

### **Testemunho 3:**
- **Nome:** Ana Costa
- **Idade:** 42 anos
- **Localização:** Brasília, DF
- **História:** Propósito e nova perspectiva de vida

## 🎯 **Quando reativar:**

- ✅ Quando tiver testemunhos reais de membros da igreja
- ✅ Quando quiser adicionar credibilidade social
- ✅ Quando tiver fotos reais dos membros
- ✅ Quando quiser destacar transformações específicas

## 📸 **Imagens necessárias:**

Para reativar completamente, você precisará das imagens:
- `/img/testimonial-1.jpg`
- `/img/testimonial-2.jpg`
- `/img/testimonial-3.jpg`

## 🔄 **Processo de reativação:**

1. **Descomentar** a constante `testimonials`
2. **Descomentar** a seção de renderização
3. **Atualizar** os dados com informações reais
4. **Adicionar** fotos reais dos membros
5. **Testar** a exibição no site
6. **Fazer commit** das alterações

## 💡 **Sugestões para futuras melhorias:**

- Adicionar mais testemunhos reais
- Incluir vídeos de depoimentos
- Criar galeria de fotos de eventos
- Adicionar filtros por categoria de transformação
- Implementar sistema de envio de testemunhos

---

**Data da desabilitação:** Janeiro 2025  
**Motivo:** Remoção temporária conforme solicitado  
**Status:** Pronto para reativação
