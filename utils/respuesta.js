const { MessageMedia } = require('whatsapp-web.js');
const natural = require('natural');
const stringSimilarity = natural.JaroWinklerDistance;
const guardarPreguntaDesconocida = require('./guardarPreguntaDesconocida.js');
const corpus = require('../corpus_mensajes/corpus/corpusCompleto.js');

function buscarRespuesta(inputUsuario) {
  let mejorCoincidencia = { puntuacion: 0.7, respuesta: "Lo siento, no entendí tu pregunta." };

  corpus.forEach(item => {
    const puntuacion = stringSimilarity(inputUsuario.toLowerCase(), item.pregunta.toLowerCase());
    if (puntuacion > mejorCoincidencia.puntuacion) {
      mejorCoincidencia = { puntuacion, respuesta: item.respuesta };
      if (item.imagen) {
        mejorCoincidencia.imagen = MessageMedia.fromFilePath(item.imagen);
      }
    }
  });

  if (mejorCoincidencia.puntuacion <= 0.7) {
    guardarPreguntaDesconocida(inputUsuario);
  }

  return {
    respuesta: mejorCoincidencia.respuesta,
    imagen: mejorCoincidencia.imagen || null,
  };
}

module.exports = buscarRespuesta;
