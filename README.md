# 🤖 Chatbot Comercial

Chatbot orientado a la atención comercial usando técnicas básicas de Procesamiento de Lenguaje Natural (PLN).

## 📌 Descripción

Este proyecto implementa un chatbot que responde a preguntas frecuentes de clientes utilizando un enfoque de coincidencia semántica. Está diseñado para ser modular, escalable y fácil de mantener, con un corpus de preguntas y respuestas organizado por temáticas (como entregas, productos, conversaciones generales, etc.).

## 🔧 Características

- Comparación semántica de preguntas usando `string-similarity`.
- Corpus dividido en módulos temáticos para facilitar su mantenimiento.
- Manejo de preguntas desconocidas, que se registran para futuras mejoras.
- Respuestas de texto y envío de imágenes según el contexto (por ejemplo, fotos de productos o celebraciones).
- Integración con `whatsapp-web.js` para la comunicación directa con usuarios vía WhatsApp.

## 🧠 Técnicas de PLN utilizadas

- Medición de similitud entre cadenas.
- Umbral de similitud para identificar coincidencias válidas.
- Diseño estructurado del corpus por categorías.

