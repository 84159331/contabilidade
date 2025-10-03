# Supabase Setup - Banco de Dados para Produção

## 🚀 Por que Supabase?

### ✅ Vantagens:
- **100% gratuito** para projetos pequenos/médios
- **PostgreSQL** (banco robusto e confiável)
- **API automática** gerada
- **Autenticação integrada**
- **Dashboard visual** para gerenciar dados
- **Backup automático**
- **Escalável** conforme cresce

### 📊 Limites gratuitos:
- **500MB** de armazenamento
- **2GB** de transferência/mês
- **50MB** de upload de arquivos
- **Suficiente** para igrejas pequenas/médias

## 🔧 Como configurar:

### 1. Criar conta no Supabase
- Acesse: https://supabase.com
- Clique em **"Start your project"**
- Faça login com GitHub

### 2. Criar novo projeto
- Clique em **"New project"**
- Escolha sua organização
- **Nome**: `igreja-contabilidade`
- **Database Password**: (anote esta senha!)
- **Region**: `South America (São Paulo)` (mais próximo do Brasil)

### 3. Aguardar setup
- O Supabase vai criar o banco (2-3 minutos)
- Anote as informações de conexão

### 4. Configurar tabelas
Execute os SQLs no editor SQL do Supabase:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de membros
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  birth_date DATE,
  member_since DATE,
  status VARCHAR(20) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category_id INTEGER REFERENCES categories(id),
  member_id INTEGER REFERENCES members(id),
  transaction_date DATE NOT NULL,
  payment_method VARCHAR(50),
  reference VARCHAR(100),
  notes TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário padrão
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@igreja.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Inserir configurações padrão
INSERT INTO settings (key, value, description) VALUES
('church_name', 'Minha Igreja', 'Nome da igreja'),
('church_address', '', 'Endereço da igreja'),
('church_phone', '', 'Telefone da igreja'),
('currency', 'BRL', 'Moeda utilizada'),
('fiscal_year_start', '01-01', 'Início do ano fiscal (MM-DD)');
```

### 5. Configurar variáveis de ambiente
No Netlify, adicione:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### 6. Testar conexão
- Use o dashboard do Supabase para verificar as tabelas
- Teste inserir dados manualmente

## 🎯 Próximos passos:
1. Criar projeto no Supabase
2. Executar SQLs das tabelas
3. Configurar variáveis no Netlify
4. Atualizar Netlify Functions
5. Testar em produção

**Supabase é a melhor opção para produção!** 🚀
