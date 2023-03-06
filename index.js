const express= require('express')
const cors = require('cors')
const path = require("path");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const router = require('./routers/router');
const { validatePost } = require('./middlewares/postMiddleware');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
    cors:{
        origin:'*'
    }
})
const users =[]
io.on('connection',(socket)=>{
    // socket.on('join-socket',({_id})=>{
    //     const exist = users.find((each)=>each._id==_id)
    //     if(exist){
    //         users = users.map(each=>each._id == _id ? {socketId: socket.id, ...each}:each);
    //     }else{
    //         users.push({_id, socketId:socket.id})
    //     }
    // })
    console.log('User connected'+socket.id);
    socket.on('user-active',(message)=>{
        console.log(message)
    })

    socket.on('send-message',(message)=>{
            socket.broadcast.emit('message-sent',message)
    })

    socket.on('join-group',(group)=>{
        socket.join(group)
    })

    socket.on('send-msg-to-group', ({group, chat})=>{
        socket.to(group).emit('msg-sent-to-group',chat);
    })
    
})

// const fileUpload = require('express-fileupload')
const app = express();
const PORT = process.env.PORT || 4000
app.use(cors())
// app.use(cors({origin:'http://localhost:3000'}))

app.use(express.static(__dirname + '/assets'))
app.use(express.json())
mongoose.set('strictQuery',true);
mongoose.connect(process.env.URI,(error)=>{
    if(error){
        console.log("Error ti wa"+error)
    }else{
        console.log("Otilor")
    }
})
// mongoose.connect(process.env.URI).then(res=>{
//     console.log('db Connected')
// }).catch(err=>{
//     console.log('An error occured when trying to connect to the db')
// })


//DOTENV

app.set('view engine',('ejs'))

app.use(express.static(path.join(__dirname,'assets')))
// app.use(bodyparser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));



// app.use('/delete/:index',validatePost)
app.use('/',router)


server.listen(PORT,()=>{
    console.log(`Server is Listening${PORT}`)
})