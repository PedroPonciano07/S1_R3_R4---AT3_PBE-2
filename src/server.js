import 'dotenv/config';
import express from 'express';
import routes from './routes/routes.js';

const app = express();

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/', routes);

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});