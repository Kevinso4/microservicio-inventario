require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Microservicio de Inventario escuchando en http://localhost:${PORT}`);
});
