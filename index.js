// Importaciones 
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const buscarRespuesta = require('./utils/respuesta');
const mensajeBienvenida = require('./corpus_mensajes/mensajeBienvenida');
const contactos = require('./contactos');

// Inicialización del cliente de WhatsApp
const client = new Client();

// Mostrar el código QR en consola
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Cliente listo: enviar mensaje de bienvenida a cada contacto
client.on('ready', async () => {
  console.log('Cliente listo para recibir mensajes');

  for (const numero of contactos) {
    try {
      const imagen = MessageMedia.fromFilePath(mensajeBienvenida.imagen);
      await client.sendMessage(numero, imagen);
      await client.sendMessage(numero, mensajeBienvenida.mensaje);
      console.log(`Mensaje de bienvenida enviado a ${numero}`);
    } catch (error) {
      console.error(`Error al enviar mensaje a ${numero}:`, error);
    }
  }
});

// Autenticación y desconexión
client.on('authenticated', () => {
  console.log('Cliente autenticado');
});

client.on('auth_failure', (msg) => {
  console.error('Error de autenticación:', msg);
});

client.on('disconnected', async (reason) => {
  console.log('Cliente desconectado:', reason);
  await client.destroy();
});

// Manejo de errores
client.on('error', (error) => {
  console.error('Error del cliente:', error);
});

// Manejo de mensajes entrantes
client.on('message', (message) => {
  console.log('Mensaje recibido:', message.body);

  const respuesta = buscarRespuesta(message.body);

  setTimeout(() => {
    console.log('Enviando respuesta:', respuesta.respuesta);
    client.sendMessage(message.from, respuesta.respuesta);
    if (respuesta.imagen) {
      client.sendMessage(message.from, respuesta.imagen);
    }
  }, 10000); // 10 segundos de espera
});

// Inicializar cliente
client.initialize();
