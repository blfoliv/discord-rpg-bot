import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega .env manualmente se existir
if (fs.existsSync(join(__dirname, '..', '.env'))) {
  const envContent = fs.readFileSync(join(__dirname, '..', '.env'), 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  });
}

// Obtém variáveis de ambiente
const token = (process.env.DISCORD_TOKEN || '').trim();
const clientId = (process.env.CLIENT_ID || '').trim();
const guildId = (process.env.GUILD_ID || '').trim();

console.log('🔍 Debug:');
console.log(`  Token: ${token ? '✅ Presente (' + token.length + ' caracteres)' : '❌ Ausente'}`);
console.log(`  ClientID: ${clientId || '❌ Ausente'}`);
console.log(`  GuildID: ${guildId || '❌ Ausente'}\n`);

if (!token) {
  console.error('❌ Erro: DISCORD_TOKEN não definido!');
  console.error('Use: DISCORD_TOKEN="seu_token" CLIENT_ID="id" GUILD_ID="id" npm run deploy');
  process.exit(1);
}

if (!clientId) {
  console.error('❌ Erro: CLIENT_ID não definido!');
  process.exit(1);
}

if (!guildId) {
  console.error('❌ Erro: GUILD_ID não definido!');
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

// Cria cliente REST
const rest = new REST({ version: '10' });

console.log('🚀 Iniciando registro de comandos...\n');

(async () => {
  try {
    console.log(`Registrando ${commands.length} comando(s) no servidor ${guildId}...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { 
        body: commands,
        headers: {
          'Authorization': `Bot ${token}`
        }
      }
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
