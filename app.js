import express from 'express';
import routes from './routes/api/index.js'

const app = express();

app.use(express.json());

app.use('/api', routes);

export default app;