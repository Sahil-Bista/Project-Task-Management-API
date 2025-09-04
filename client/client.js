import { io } from "socket.io-client";

//Creating a client simply means creating a socket instance
const socket = io('http://localhost:3000');

socket.on('connect',()=>{
    console.log('Client connected');
    socket.emit('joinProject',ProjectId);
});

socket.on('taskCreated',(task)=>{
    console.log('Task created', task);
});

