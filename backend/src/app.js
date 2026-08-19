const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const inventarioRoutes = require('./routes/inventarioRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'microservicio-inventario' });
});

app.use('/', inventarioRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
