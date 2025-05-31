const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const natural = require('natural');
const stringSimilarity = natural.JaroWinklerDistance;
const fs = require('fs');
const path = require('path');
const client = new Client();

const corpus = require('./mensajes//corpus/corpus.js');
const mensajeBienvenida = require('./mensajes/mensajeBienvenida.js');
const logo = MessageMedia.fromFilePath('./media/bienvenida.jpeg');
const contactos = require('./contactos.js');
const preguntasDesconocidas =  path.join(__dirname, 'mensajes', 'preguntasDesconocidas.json');


function guardarPreguntaDesconocida(pregunta) {
  let preguntas = [];

  try {
    if (fs.existsSync(preguntasDesconocidas)) {
      const data = fs.readFileSync(preguntasDesconocidas, 'utf8');
      preguntas = JSON.parse(data);
    }

    if (!preguntas.includes(pregunta)) {
      preguntas.push({ pregunta: pregunta, respuesta: "Lo siento, no entendí tu pregunta." });
      fs.writeFileSync(preguntasDesconocidas, JSON.stringify(preguntas, null, 2), 'utf8');
      console.log('Pregunta desconocida guardada:', pregunta);
    }
  } catch (err) {
    console.error('Error al guardar pregunta desconocida:', err);
  }
}


function buscarRespuesta(inputUsuario) {
  let mejorCoincidencia = { puntuacion: 0.7, respuesta: "Lo siento, no entendí tu pregunta." };

  corpus.forEach(item => {
    const puntuacion = stringSimilarity(inputUsuario.toLowerCase(), item.pregunta.toLowerCase());
    if (puntuacion > mejorCoincidencia.puntuacion) {
      mejorCoincidencia = { puntuacion, respuesta: item.respuesta };
      if(item.imagen) {
        mejorCoincidencia = { ...mejorCoincidencia, imagen: MessageMedia.fromFilePath(item.imagen) };
      }
    }
  });
  // Si la puntuación no es suficiente, guardar la pregunta
  if (mejorCoincidencia.puntuacion <= 0.7) {
    guardarPreguntaDesconocida(inputUsuario);
  }
  if (mejorCoincidencia.imagen) {
    return { respuesta: mejorCoincidencia.respuesta,
             imagen: mejorCoincidencia.imagen };
  }
  return { respuesta: mejorCoincidencia.respuesta };
}

// WhatsApp
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});


client.on('ready', async () => {
  console.log('Cliente listo para recibir mensajes');

  for (const numero of contactos) {
    try {
      await client.sendMessage(numero, logo);
      await client.sendMessage(numero, mensajeBienvenida);
      console.log(`Mensaje enviado correctamente`);
    } catch (error) {
      console.error(`Error al enviar mensaje:`, error);
    }
  }
})

client.on('authenticated', () => {
  console.log('Cliente autenticado');
});

client.on('auth_failure', msg => {
    console.error('Error de autenticación:', msg);
    });

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
    client.destroy();
    client.initialize();
  });


// Escucha mensajes entrantes
client.on('message', message => {
  console.log('Mensaje recibido:', message.body);

  const respuesta = buscarRespuesta(message.body);

  // Esperar 10 segundos antes de enviar la respuesta
  setTimeout(() => {
    console.log('Enviando respuesta:', respuesta.respuesta);
    client.sendMessage(message.from, respuesta.respuesta);
    if (respuesta.imagen) {
      client.sendMessage(message.from, respuesta.imagen);
    }
  }, 10000);
});


client.initialize();