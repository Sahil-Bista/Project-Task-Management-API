import mongoose from "mongoose";
import { connectDB } from "./config/connDB.js";
import app from './app.js';
import {createServer} from 'http';
import { Server } from "socket.io";

const httpServer = createServer(app);

export const io = new Server(httpServer,{
    cors : {
        origin : '*'
    }
});

io.on('connection',(socket)=>{
    console.log('A user connected');

    socket.on('joinProject',(projectId)=>{
        socket.join(projectId);
        console.log(`User ${socket.id} connected to room ${projectId}`);
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected from socket server');
    })
})

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