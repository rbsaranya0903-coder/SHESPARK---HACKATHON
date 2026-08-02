const fs = require('fs');

async function listModels() {
  const envFile = fs.readFileSync('backend/.env', 'utf8');
  const keyMatch = envFile.match(/GEMINI_API_KEY=(.*)/);
  if (!keyMatch) return console.log("No key");
  const key = keyMatch[1].trim();

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    if (data.models) {
      console.log(data.models.map(m => m.name).join('\n'));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
}
listModels();
