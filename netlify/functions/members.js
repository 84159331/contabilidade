// Function para buscar membros
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDW73K6vb7RMdyfsJ6JVzzm1r3sULs4ceY",
  authDomain: "comunidaderesgate-82655.firebaseapp.com",
  projectId: "comunidaderesgate-82655",
  storageBucket: "comunidaderesgate-82655.firebasestorage.app",
  messagingSenderId: "587928941365",
  appId: "1:587928941365:web:b788b8c9acf0a20992d27c",
  measurementId: "G-485FKRFYHE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async (event, context) => {
  console.log('👥 Members function chamada:', event.httpMethod);
  
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Lidar com preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      console.log('📊 Buscando membros do Firestore...');
      
      const membersRef = collection(db, 'members');
      const q = query(membersRef, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      
      const members = [];
      snapshot.forEach((doc) => {
        members.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`✅ ${members.length} membros encontrados`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          members,
          total: members.length
        })
      };
    }

    if (event.httpMethod === 'POST') {
      console.log('💾 Criando novo membro no Firestore...');
      
      const body = JSON.parse(event.body || '{}');
      const { 
        name, 
        email, 
        phone, 
        address, 
        birth_date, 
        member_since, 
        status, 
        notes 
      } = body;

      // Validação básica
      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Campo obrigatório: name' 
          })
        };
      }

      // Preparar dados para o Firestore
      const memberData = {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        birth_date: birth_date || null,
        member_since: member_since || null,
        status: status || 'active',
        notes: notes || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Salvar no Firestore
      const membersRef = collection(db, 'members');
      const docRef = await addDoc(membersRef, memberData);

      console.log('✅ Membro salvo no Firestore com ID:', docRef.id);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Membro criado com sucesso',
          member: {
            id: docRef.id,
            ...memberData
          }
        })
      };
    }

  } catch (error) {
    console.error('❌ Erro na function members:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message 
      })
    };
  }
};
