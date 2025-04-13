const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client();
client.on('qr', (qr) => {
  console.log('QR RECEBIDO', qr);
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

app.get('/foto', async (req, res) => {
  const numero = req.query.numero;
  if (!numero) {
    return res.status(400).send('Número não informado');
  }

  try {
    const chatId = numero.includes('@c.us') ? numero : `${numero}@c.us`;
    const ppUrl = await client.getProfilePicUrl(chatId);
    res.redirect(ppUrl);
  } catch (err) {
    res.status(500).send('Erro ao buscar foto: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
