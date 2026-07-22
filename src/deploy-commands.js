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
const token = process.env.DISCORD_TOKEN?.trim();
const clientId = process.env.CLIENT_ID?.trim();
const guildId = process.env.GUILD_ID?.trim();

console.log('🔍 Debug:');
console.log(`  Token: ${token ? '✅ Presente' : '❌ Ausente'}`);
console.log(`  ClientID: ${clientId || '❌ Ausente'}`);
console.log(`  GuildID: ${guildId || '❌ Ausente'}\n`);

if (!token) {
  console.error('❌ Erro: DISCORD_TOKEN não definido no .env');
  process.exit(1);
}

if (!clientId) {
  console.error('❌ Erro: CLIENT_ID não definido no .env');
  process.exit(1);
}

if (!guildId) {
  console.error('❌ Erro: GUILD_ID não definido no .env');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente validadas');
console.log('📝 Carregando comandos...\n');

const commands = [];

// Carrega todos os comandos
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  try {
    const { default: command } = await import(`file://${filePath}`);
    if (command.data) {
      commands.push(command.data.toJSON());
      console.log(`  ✅ ${file}`);
    }
  } catch (error) {
    console.error(`  ❌ Erro em ${file}:`, error.message);
  }
}

console.log(`\n📋 Total de comandos carregados: ${commands.length}\n`);

// Cria cliente REST com o token DIRETO NO CONSTRUTOR
const rest = new REST({ 
  version: '10',
  authPrefix: 'Bot'
});

// Define o token após criação
rest.setToken(token);

console.log('🚀 Iniciando registro de comandos...\n');

(async () => {
  try {
    console.log(`Registrando ${commands.length} comando(s) no servidor ${guildId}...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`\n✅ Sucesso! ${data.length} comando(s) registrado(s)!\n`);
    data.forEach((cmd) => console.log(`  • /${cmd.name}`));
    console.log('\n✨ Bot pronto para usar!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao registrar comandos:');
    if (error.status === 401) {
      console.error('❌ Token inválido ou expirado!');
    } else if (error.status === 403) {
      console.error('❌ Permissão negada. Verifique as permissões do bot.');
    } else if (error.message) {
      console.error(`❌ ${error.message}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
})();
