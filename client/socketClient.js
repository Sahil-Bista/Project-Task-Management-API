import { io } from "socket.io-client";

//Creating a client simply means creating a socket instance
const socket = io('http://localhost:3000');

socket.on('connect',()=>{
    console.log('Client connected');
    //here a valid project Id that is also in the req body for creating/ updating or delting tasks will be required
    socket.emit('joinProject',"68b7d2c0cfa5556ac06b39ee");
});

socket.on('taskCreated',(task)=>{
    console.log('Task created', task);
});

socket.on('taskStatusUpdate', ({name, status})=>{
    console.log(`Task status updated to ${status} for task ${name}`);
})

socket.on('taskDeletion', (deletedTask)=>{
    console.log('Task deleted', deletedTask);
})