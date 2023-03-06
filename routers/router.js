const express = require('express')
const router = express.Router()
const { createPost, deletePost, editPost, updatePost, viewPost, getPost, newPostPage} = require('../controllers/postController');
const multer = require('multer');
const { register, login, getUser } = require('../controllers/userController');
const { storage } = require('../upload');
const verifyUser = require('../middlewares/authMiddleware');
// const upload = multer({dest:'assets/postimages'})
const upload = multer({storage})

router.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

router.get('/profile/:username',(req,res)=>{
    const {username} = req.params
    console.log(req.query)
    const {school,age,dept} = req.query
    res.send(`Here is the profile for ${username} ${school} ${age} ${dept}`)
})

let posts = [];
router.get('/new-post',newPostPage)

router.post('/new-post', upload.single('picture'), createPost)

router.get('/get-post',getPost)

router.post('/register',register)

router.post('/login',login)

router.get('/profile',verifyUser, getUser)

router.post('/delete/:_id',deletePost)

router.get('/view/:_id',viewPost)

router.get('/edit/:_id',editPost)

router.post('/edit-post/:_id',updatePost)

router.get('/home',(req,res)=>{
    const myName='Afolabi'
    const user={
        name:"Afolabi Peace",
        school:"SQI",
        dept:"Software Engineering",
        contact:09133289357,
        address:'Areago High School'
    }
    const numbers = [0,1,2,3,4,5,6,7,8,9]
    res.render('home',{name:myName,user,numbers});
})
router.get('/contact',(req,res)=>{
    const user={
        name:"Afolabi Peace",
        contact:09133289357,
    }
    res.render('contact',{user})
})
router.get('/about',(req,res)=>{
    const user={
        name:"Afolabi Peace",
        address:'Areago High School'
    }
    res.render('about',{user})
})
router.get('/signin',(req,res)=>{
    res.render('signin')
})

module.exports = router