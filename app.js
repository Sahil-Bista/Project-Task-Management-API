import express from 'express';
import routes from './routes/api/index.js'
import { globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use((req , res , next)=>{
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
})

app.use(globalErrorHandler);

export default app;