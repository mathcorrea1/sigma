# 📁 Estrutura do Frontend - Boas Práticas

## Arquitetura Refatorada

O frontend foi refatorado seguindo as melhores práticas de desenvolvimento React moderno, com foco em escalabilidade, manutenibilidade e reusabilidade.

### 🗂️ Estrutura de Pastas

```
src/
├── assets/              # Recursos estáticos (imagens, ícones)
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, Modal, etc.)
│   └── ...             # Componentes específicos (ProductForm, Header, etc.)
├── contexts/           # Contextos globais (NotificationContext, AuthContext)
├── handlers/           # Classes para integração com API
│   ├── auth.js         # Operações de autenticação
│   ├── product.js      # Operações de produtos
│   └── transaction.js  # Operações de transações
├── hooks/              # Custom hooks
│   ├── useForm.js      # Hook para formulários com Zod
│   ├── useErrorHandler.js # Hook para tratamento de erros
│   └── useConfirmation.js # Hook para confirmações
├── i18n/               # Internacionalização
│   ├── index.js        # Configuração do i18next
│   └── locales/        # Arquivos de tradução
├── pages/              # Páginas/Rotas principais
│   ├── Login.jsx       # Página de login
│   ├── Produtos.jsx    # Página de produtos
│   └── Caixa.jsx       # Página de caixa
├── routes/             # Configuração de rotas
│   └── index.js        # Definição das rotas com React Router
├── schemas/            # Esquemas de validação com Zod
│   ├── auth.js         # Validações de autenticação
│   ├── product.js      # Validações de produtos
│   └── transaction.js  # Validações de transações
├── services/           # Configuração de serviços externos
│   └── api.js          # Configuração do axios
├── styles/             # Estilos globais e temas
│   ├── index.css       # Estilos globais
│   └── App.css         # Estilos do componente App
└── utils/              # Funções auxiliares
    ├── constants.js    # Constantes da aplicação
    ├── formatters.js   # Funções de formatação
    └── validators.js   # Funções de validação
```

## 🔧 Principais Melhorias Implementadas

### 1. **Validação com Zod**
- Esquemas de validação tipados e reutilizáveis
- Validação em tempo real
- Mensagens de erro específicas e traduzidas
- Integração seamless com formulários

### 2. **Hook Personalizado para Formulários**
```javascript
const {
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting
} = useForm({
  schema: productCreateSchema,
  initialValues: { nome: '', valor: '' },
  onSubmit: async (data) => { ... }
});
```

### 3. **Handlers para API**
- Classes organizadas por domínio
- Validação automática de dados
- Tratamento de erros centralizado
- Tipagem implícita via Zod

### 4. **Sistema de Rotas Avançado**
- Lazy loading de páginas
- Proteção de rotas
- Redirecionamentos inteligentes
- Configuração centralizada

### 5. **Tratamento de Erros Robusto**
- Hook `useErrorHandler` para tratamento centralizado
- Mapeamento inteligente de erros do servidor
- Mensagens específicas por campo
- Fallbacks adequados

### 6. **Utilitários Organizados**
- **Constants**: URLs, configurações, enums
- **Formatters**: Datas, moedas, números
- **Validators**: CPF, email, URLs

## 📋 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`ProductForm.jsx`)
- **Hooks**: camelCase com prefixo `use` (`useForm.js`)
- **Handlers**: PascalCase com sufixo `Handler` (`ProductHandler`)
- **Utils**: camelCase (`formatCurrency`)

### Estrutura de Componentes
```javascript
// 1. Imports externos
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Imports internos
import { useForm } from '../hooks/useForm';
import { productSchema } from '../schemas/product';

// 3. Imports de componentes
import Button from './ui/Button';

// 4. Definição do componente
const ProductForm = ({ product, onSubmit }) => {
  // 5. Hooks
  const { t } = useTranslation();
  const { values, errors, handleSubmit } = useForm({...});

  // 6. Estados locais
  const [isLoading, setIsLoading] = useState(false);

  // 7. Funções
  const handleSave = async () => { ... };

  // 8. JSX
  return (
    <div>
      ...
    </div>
  );
};

export default ProductForm;
```

## 🚀 Benefícios da Refatoração

### Escalabilidade
- Estrutura modular permite crescimento fácil
- Separação de responsabilidades clara
- Reutilização de código maximizada

### Manutenibilidade
- Código mais legível e organizado
- Debugging facilitado
- Testes mais simples

### Performance
- Lazy loading de páginas
- Componentes otimizados
- Bundle splitting automático

### Developer Experience
- Autocompletar melhorado
- Validação em tempo real
- Hot reload preservado

### Qualidade de Código
- Validação tipada com Zod
- Tratamento de erros consistente
- Padrões de código padronizados

## 🧪 Como Usar

### Criando um Novo Formulário
```javascript
import { useForm } from '../hooks/useForm';
import { mySchema } from '../schemas/mySchema';

const MyForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    schema: mySchema,
    initialValues: { field: '' },
    onSubmit: async (data) => {
      // Dados já validados e transformados
      await MyHandler.create(data);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input {...getFieldProps('field')} />
    </form>
  );
};
```

### Adicionando Nova Página
1. Criar arquivo em `pages/`
2. Adicionar rota em `routes/index.js`
3. Configurar lazy loading se necessário

### Criando Novo Handler
1. Criar classe em `handlers/`
2. Definir métodos estáticos
3. Usar esquemas Zod para validação
4. Implementar tratamento de erros

## 📚 Tecnologias Utilizadas

- **React 18** - Framework principal
- **Zod** - Validação de esquemas
- **React Router 6** - Roteamento
- **React i18next** - Internacionalização
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização

Esta estrutura garante que o projeto seja escalável, manutenível e siga as melhores práticas do mercado atual de desenvolvimento React.
