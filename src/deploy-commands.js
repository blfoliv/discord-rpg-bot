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
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Obtém variáveis de ambiente
const token = (process.env.DISCORD_TOKEN || '').trim();
const clientId = (process.env.CLIENT_ID || '').trim();
const guildId = (process.env.GUILD_ID || '').trim();

console.log('🔍 Verificando variáveis de ambiente:');
console.log(`  Token: ${token ? '✅ Carregado (' + token.substring(0, 10) + '...)' : '❌ NÃO ENCONTRADO'}`);
console.log(`  ClientID: ${clientId ? '✅ ' + clientId : '❌ NÃO ENCONTRADO'}`);
console.log(`  GuildID: ${guildId ? '✅ ' + guildId : '❌ NÃO ENCONTRADO'}\n`);

if (!token || token.length < 10) {
  console.error('❌ Erro: DISCORD_TOKEN inválido ou não definido!');
  console.error('\n📝 Como usar:');
  console.error('  1. Via CLI: DISCORD_TOKEN="seu_token" CLIENT_ID="id" GUILD_ID="id" npm run deploy');
  console.error('  2. Via .env: Criar arquivo .env com as 3 variáveis\n');
  process.exit(1);
}

if (!clientId || !guildId) {
  console.error('❌ Erro: CLIENT_ID ou GUILD_ID não definido!');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente OK');
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
    console.error(`  ❌ ${file}: ${error.message}`);
  }
}

console.log(`\n📋 Total: ${commands.length} comando(s)\n`);

// Função auxiliar para fazer PUT request com token
async function putCommands() {
  const url = `https://discord.com/api/v10/applications/${clientId}/guilds/${guildId}/commands`;
  
  console.log(`🚀 Enviando requisição para: ${url}\n`);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${token}`,
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro na API do Discord:');
      console.error(`  Status: ${response.status}`);
      console.error(`  Mensagem: ${error.message || JSON.stringify(error)}\n`);
      process.exit(1);
    }

    const data = await response.json();
    
    console.log(`✅ Sucesso! ${data.length || 0} comando(s) registrado(s)!\n`);
    if (Array.isArray(data)) {
      data.forEach((cmd) => console.log(`  • /${cmd.name}`));
    }
    console.log('\n✨ Bot pronto para usar!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar com Discord API:');
    console.error(`  ${error.message}\n`);
    process.exit(1);
  }
}

await putCommands();
