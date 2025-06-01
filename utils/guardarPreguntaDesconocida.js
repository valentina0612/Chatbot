const fs = require('fs');
const path = require('path');

const preguntasDesconocidas = path.join(__dirname, '..', 'corpus_mensajes', 'preguntasDesconocidas.json');

function guardarPreguntaDesconocida(pregunta) {
  let preguntas = [];

  try {
    if (fs.existsSync(preguntasDesconocidas)) {
      const data = fs.readFileSync(preguntasDesconocidas, 'utf8');
      preguntas = JSON.parse(data);
    }

    if (!preguntas.some(p => p.pregunta === pregunta)) {
      preguntas.push({ pregunta, respuesta: "Lo siento, no entendí tu pregunta." });
      fs.writeFileSync(preguntasDesconocidas, JSON.stringify(preguntas, null, 2), 'utf8');
      console.log('Pregunta desconocida guardada:', pregunta);
    }
  } catch (err) {
    console.error('Error al guardar pregunta desconocida:', err);
  }
}

module.exports = guardarPreguntaDesconocida;
