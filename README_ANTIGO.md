# Sistema de Inscrição para Eventos - Igreja

Este projeto implementa um sistema completo de inscrição para eventos da igreja, desenvolvido com **TypeScript** e seguindo as melhores práticas de desenvolvimento frontend.

## ?? Arquitetura e Estrutura

### Estrutura de Pastas Organizada

```
src/
??? components/
?   ??? layout/           # Componentes de layout (Header, Footer, Hero)
?   ??? pages/            # Componentes de página (About, Services, Events, etc.)
?   ??? registration/     # Sistema de inscrição
?   ?   ??? RegistrationForm.tsx
?   ?   ??? AdminDashboard.tsx
?   ?   ??? RegistrationConfirmation.tsx
?   ??? ui/               # Componentes reutilizáveis (futuro)
??? hooks/                # Custom hooks
?   ??? useEventRegistration.ts
??? types/                # Definições TypeScript
?   ??? index.ts
??? utils/                # Utilitários e helpers
?   ??? index.ts
??? constants/            # Constantes e configurações
?   ??? index.ts
??? styles/               # Estilos organizados
?   ??? variables.css     # Variáveis CSS customizadas
?   ??? components/       # Estilos de componentes (futuro)
?   ??? layout/          # Estilos de layout (futuro)
?   ??? pages/           # Estilos de páginas (futuro)
??? assets/              # Recursos estáticos (imagens, ícones)
```

## ?? Tecnologias Utilizadas

- **React 18** com **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **LocalStorage** - Persistência local de dados

## Como Usar

### 1. Visualizar Eventos
- Acesse a página principal do site
- Navegue até a seção "Próximos Eventos"
- Veja informações sobre cada evento incluindo vagas disponíveis

### 2. Fazer Inscrição
- Clique no botão "Inscrever-se" em qualquer evento
- Preencha o formulário com suas informações
- Clique em "Confirmar Inscrição"
- Receberá uma confirmação imediata

### 3. Dashboard Administrativo
- Clique no botão "Admin" no canto superior direito
- Visualize todas as inscrições
- Use filtros para encontrar inscrições específicas
- Altere status das inscrições
- Exporte dados para CSV

### 4. Página de Confirmação
- Clique no botão "Confirmação" para visualizar uma inscrição
- Veja detalhes completos da inscrição
- Edite informações se necessário
- Imprima ou cancele a inscrição

## Campos do Formulário

### Obrigatórios
- **Nome Completo**: Nome do participante
- **E-mail**: Endereço de e-mail válido
- **Telefone**: Número de telefone com DDD

### Opcionais
- **Organização/Empresa**: Empresa ou organização que representa
- **Restrições Alimentares**: Vegetariano, vegano, sem glúten, alergia a nozes, outros
- **Necessidades de Acessibilidade**: Descrição de necessidades especiais

## Status das Inscrições

- **Confirmada**: Inscrição ativa e confirmada
- **Pendente**: Aguardando confirmação ou processamento
- **Cancelada**: Inscrição cancelada pelo participante ou organizador

## Capacidade dos Eventos

Cada evento tem uma capacidade máxima definida:
- Conferência de Avivamento: 200 vagas
- Retiro de Casais: 50 vagas
- Acampamento Jovem: 100 vagas
- Dia da Família: 300 vagas

## Validações Implementadas

- **E-mail**: Formato válido (usuario@dominio.com)
- **Telefone**: Formato brasileiro ((XX) XXXXX-XXXX)
- **Campos obrigatórios**: Verificação de preenchimento
- **Capacidade**: Controle de vagas disponíveis

## Próximos Passos (Backend)

Para uma implementação completa em produção, recomenda-se:

1. **Backend API**: Node.js/Express ou similar
2. **Banco de dados**: PostgreSQL, MySQL ou MongoDB
3. **Autenticação**: Sistema de login para administradores
4. **E-mails**: Integração com serviço de e-mail (SendGrid, Mailgun)
5. **Pagamentos**: Integração com gateways de pagamento
6. **Notificações**: Sistema de notificações push/webhooks

## Tecnologias Utilizadas

- **React 18**: Framework frontend
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **LocalStorage**: Persistência local
- **Vite**: Build tool e dev server

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em `http://localhost:5173`

## Testando o Sistema

1. **Inscrição**: Tente se inscrever em um evento
2. **Admin**: Acesse o dashboard e veja a inscrição criada
3. **Confirmação**: Visualize os detalhes da inscrição
4. **Edição**: Teste editar informações no modo de confirmação
5. **Cancelamento**: Teste cancelar uma inscrição

O sistema está totalmente funcional para demonstração e pode ser facilmente adaptado para produção com a implementação do backend.
