const infoGeneral = require('./infoGeneral.js');
const productos = require('./productos.js'); 
const pedidos = require('./pedidos.js');
const entregas = require('./entregas.js');
const promociones = require('./promociones.js');
const saludos = require('./conversacion.js');

// Unir todos los corpus en uno solo
const corpus = [
  ...infoGeneral,
  ...productos,
  ...pedidos,
  ...entregas,
  ...promociones,
  ...saludos
];

module.exports = corpus;