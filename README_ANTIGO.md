# Sistema de Inscri��o para Eventos - Igreja

Este projeto implementa um sistema completo de inscri��o para eventos da igreja, desenvolvido com **TypeScript** e seguindo as melhores pr�ticas de desenvolvimento frontend.

## ?? Arquitetura e Estrutura

### Estrutura de Pastas Organizada

```
src/
??? components/
?   ??? layout/           # Componentes de layout (Header, Footer, Hero)
?   ??? pages/            # Componentes de p�gina (About, Services, Events, etc.)
?   ??? registration/     # Sistema de inscri��o
?   ?   ??? RegistrationForm.tsx
?   ?   ??? AdminDashboard.tsx
?   ?   ??? RegistrationConfirmation.tsx
?   ??? ui/               # Componentes reutiliz�veis (futuro)
??? hooks/                # Custom hooks
?   ??? useEventRegistration.ts
??? types/                # Defini��es TypeScript
?   ??? index.ts
??? utils/                # Utilit�rios e helpers
?   ??? index.ts
??? constants/            # Constantes e configura��es
?   ??? index.ts
??? styles/               # Estilos organizados
?   ??? variables.css     # Vari�veis CSS customizadas
?   ??? components/       # Estilos de componentes (futuro)
?   ??? layout/          # Estilos de layout (futuro)
?   ??? pages/           # Estilos de p�ginas (futuro)
??? assets/              # Recursos est�ticos (imagens, �cones)
```

## ?? Tecnologias Utilizadas

- **React 18** com **TypeScript**
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilit�rio
- **Lucide React** - Biblioteca de �cones
- **LocalStorage** - Persist�ncia local de dados

## Como Usar

### 1. Visualizar Eventos
- Acesse a p�gina principal do site
- Navegue at� a se��o "Pr�ximos Eventos"
- Veja informa��es sobre cada evento incluindo vagas dispon�veis

### 2. Fazer Inscri��o
- Clique no bot�o "Inscrever-se" em qualquer evento
- Preencha o formul�rio com suas informa��es
- Clique em "Confirmar Inscri��o"
- Receber� uma confirma��o imediata

### 3. Dashboard Administrativo
- Clique no bot�o "Admin" no canto superior direito
- Visualize todas as inscri��es
- Use filtros para encontrar inscri��es espec�ficas
- Altere status das inscri��es
- Exporte dados para CSV

### 4. P�gina de Confirma��o
- Clique no bot�o "Confirma��o" para visualizar uma inscri��o
- Veja detalhes completos da inscri��o
- Edite informa��es se necess�rio
- Imprima ou cancele a inscri��o

## Campos do Formul�rio

### Obrigat�rios
- **Nome Completo**: Nome do participante
- **E-mail**: Endere�o de e-mail v�lido
- **Telefone**: N�mero de telefone com DDD

### Opcionais
- **Organiza��o/Empresa**: Empresa ou organiza��o que representa
- **Restri��es Alimentares**: Vegetariano, vegano, sem gl�ten, alergia a nozes, outros
- **Necessidades de Acessibilidade**: Descri��o de necessidades especiais

## Status das Inscri��es

- **Confirmada**: Inscri��o ativa e confirmada
- **Pendente**: Aguardando confirma��o ou processamento
- **Cancelada**: Inscri��o cancelada pelo participante ou organizador

## Capacidade dos Eventos

Cada evento tem uma capacidade m�xima definida:
- Confer�ncia de Avivamento: 200 vagas
- Retiro de Casais: 50 vagas
- Acampamento Jovem: 100 vagas
- Dia da Fam�lia: 300 vagas

## Valida��es Implementadas

- **E-mail**: Formato v�lido (usuario@dominio.com)
- **Telefone**: Formato brasileiro ((XX) XXXXX-XXXX)
- **Campos obrigat�rios**: Verifica��o de preenchimento
- **Capacidade**: Controle de vagas dispon�veis

## Pr�ximos Passos (Backend)

Para uma implementa��o completa em produ��o, recomenda-se:

1. **Backend API**: Node.js/Express ou similar
2. **Banco de dados**: PostgreSQL, MySQL ou MongoDB
3. **Autentica��o**: Sistema de login para administradores
4. **E-mails**: Integra��o com servi�o de e-mail (SendGrid, Mailgun)
5. **Pagamentos**: Integra��o com gateways de pagamento
6. **Notifica��es**: Sistema de notifica��es push/webhooks

## Tecnologias Utilizadas

- **React 18**: Framework frontend
- **TypeScript**: Tipagem est�tica
- **Tailwind CSS**: Estiliza��o
- **Lucide React**: �cones
- **LocalStorage**: Persist�ncia local
- **Vite**: Build tool e dev server

## Como Executar

1. Instale as depend�ncias:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em `http://localhost:5173`

## Testando o Sistema

1. **Inscri��o**: Tente se inscrever em um evento
2. **Admin**: Acesse o dashboard e veja a inscri��o criada
3. **Confirma��o**: Visualize os detalhes da inscri��o
4. **Edi��o**: Teste editar informa��es no modo de confirma��o
5. **Cancelamento**: Teste cancelar uma inscri��o

O sistema est� totalmente funcional para demonstra��o e pode ser facilmente adaptado para produ��o com a implementa��o do backend.
