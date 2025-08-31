import mongoose from "mongoose";
import { connectDB } from "./config/connDB.js";
import app from './app.js';

let server;

export const startServer= async(PORT)=>{
    try{
        await connectDB();
        server = app.listen(PORT, ()=>{
            console.log(`App is listening on PORT ${PORT}`);
        })
    }catch(error){
        console.error('Error creating server',error);
        process.exit(1);
    }
}

export const handleShutDown = () => {
    process.on('SIGINT', async()=>{
        console.log('Shutting down');
        if (server) server.close(()=> console.log('Server closed'));

        await mongoose.connection.close();
        console.log('Mongo Connection Closed');
        process.exit(0);
    });

    process.on('SIGTERM', async()=>{
        console.log('Shutting down the server');
        if(server) server.close(()=>console.log('Server shut down'));

        await mongoose.connection.close();
        console.log('Mongo connection closed');
        process.exit(0);
    });
}