import dotenv from 'dotenv';
import { handleShutDown , startServer} from './server.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

startServer(PORT);
handleShutDown();


