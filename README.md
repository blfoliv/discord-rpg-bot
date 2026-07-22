# Discord RPG Bot

Um bot para Discord desenvolvido com Node.js, discord.js v14 e SQLite que implementa um sistema RPG simples com atributos de personagem.

## 🚀 Funcionalidades

- **Sistema de Registro**: Crie sua conta com `/registrar`
- **Atributos**: Gerencie Potência, Destreza, Sustento e Essência
- **Pontos Livres**: Distribua pontos entre seus atributos
- **Treino**: Treine atributos para ganhar pontos aleatórios (com cooldown de 24h)
- **Comandos Admin**: Adicione pontos, altere atributos e resete personagens

## 📋 Requisitos

- Node.js 16.9.0 ou superior
- npm ou yarn
- Token do Discord Bot
- Client ID do Discord Bot
- Guild ID (ID do servidor)

## 📦 Instalação

1. Clone este repositório:
```bash
git clone <seu-repositorio>
cd discord-rpg-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha o arquivo `.env` com:
   - `DISCORD_TOKEN`: Seu token do bot Discord
   - `CLIENT_ID`: ID da aplicação Discord
   - `GUILD_ID`: ID do servidor onde testar

## 🎮 Comandos

### Comandos Gerais

- `/registrar` - Registra você como um novo jogador
- `/status` - Mostra seus atributos atuais
- `/upar <atributo> <quantidade>` - Aumenta um atributo com Pontos Livres
- `/treinar <atributo>` - Treina um atributo para ganhar pontos aleatórios

### Comandos de Administrador

- `/addpontos <jogador> <quantidade>` - Adiciona Pontos Livres a um jogador
- `/setstatus <jogador> <atributo> <valor>` - Define um atributo para um valor específico
- `/resetstatus <jogador>` - Reseta os atributos de um jogador para os valores padrão

## 🏗️ Estrutura do Projeto

```
src/
├── index.js                 # Arquivo principal do bot
├── deploy-commands.js       # Script para registrar comandos
├── commands/                # Comandos slash do bot
│   ├── registrar.js
│   ├── status.js
│   ├── upar.js
│   ├── treinar.js
│   ├── addpontos.js
│   ├── setstatus.js
│   └── resetstatus.js
├── events/                  # Eventos do bot
│   ├── ready.js
│   └── interactionCreate.js
├── database/                # Módulos de banco de dados
│   ├── init.js              # Inicialização do banco
│   ├── player.js            # Operações de jogadores
│   └── cooldown.js          # Gerenciamento de cooldowns
├── embeds/                  # Embeds formatados
│   └── statusEmbed.js
└��─ utils/                   # Utilitários
    ├── permissions.js       # Verificação de permissões
    └── validators.js        # Validadores
```

## 🚀 Como Executar

1. Deploy dos comandos (primeira vez apenas):
```bash
npm run deploy
```

2. Inicie o bot:
```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📊 Sistema de Atributos

Todos os jogadores começam com:
- ⚔️ **Potência**: 5
- 🎯 **Destreza**: 5
- 🛡️ **Sustento**: 5
- ✨ **Essência**: 5
- ⭐ **Pontos Livres**: 5

## ⏱️ Sistema de Cooldown

- Cada atributo pode ser treinado **uma vez a cada 24 horas**
- O ganho de treino é aleatório entre **1 e 5 pontos**
- Não há limite de uso para `/upar` enquanto tiver Pontos Livres

## 🔒 Banco de Dados

O bot utiliza SQLite com as seguintes tabelas:

### Tabela: `players`
- `user_id` - ID único do usuário Discord
- `username` - Nome do usuário
- `potencia` - Valor do atributo Potência
- `destreza` - Valor do atributo Destreza
- `sustento` - Valor do atributo Sustento
- `essencia` - Valor do atributo Essência
- `pontos_livres` - Pontos disponíveis para distribuição
- `created_at` - Data de criação
- `updated_at` - Data da última atualização

### Tabela: `training_cooldowns`
- `user_id` - ID do usuário
- `attribute` - Nome do atributo treinado
- `last_trained` - Data e hora do último treino

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir uma issue ou pull request.
