import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

// Carrega variáveis de ambiente
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Valida variáveis de ambiente
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ Erro: DISCORD_TOKEN não definido no .env');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('❌ Erro: CLIENT_ID não definido no .env');
  process.exit(1);
}

if (!process.env.GUILD_ID) {
  console.error('❌ Erro: GUILD_ID não definido no .env');
  process.exit(1);
}

const commands = [];

// Carrega todos os comandos
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: command } = await import(`file://${filePath}`);
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

// Cria cliente REST com token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`📝 Registrando ${commands.length} comandos...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(`✅ ${data.length} comandos registrados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
    process.exit(1);
  }
})();
