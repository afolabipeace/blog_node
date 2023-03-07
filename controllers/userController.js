const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { sendMail } = require('../mail')
dotenv.config()

const register = (req, res) => {
    const { firstname, lastname, email, password } = req.body
    User.create({ firstname, lastname, email, password }, async (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'An Error'
            })
        } else {
            console.log("yyy");
           try {
                await sendMail({
                    to:email,
                    subject:'Registration successful',
                    html:`
                        <div>
                            <h3 style='font-size:20px'>Welcome</h3>
                            <p>You are welcome ${firstname} to LifestyleBlog</p>
                        </div>
                    `
                });
            } catch (error) {
            console.log('An error occured when trying to send email');
            
           }
            res.json({
                success: true,
                message: 'User Registration Succesful',
                data
            })
        }
    })
}

const login = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }).select("+password").exec(async (err, data) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'An Error'
            })
        } else {
            if (data) {
                try {
                    const validPassword = await bcrypt.compare(password, data.password)
                    if (validPassword) {
                        const token = jwt.sign(
                            {email:data.email,_id:data._id},
                            process.env.jwt_SECRET,
                            {expiresIn:60}
                        )
                        data.password = '';
                        res.json({
                            token,
                            success: true,
                            message: "signed in",
                            data
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Password is not correct'
                        })
                    }
                } catch (error) {
                    res.send(error)
                    console.log(error)
                }

            } else {
                res.status(400).json({
                    success: false,
                    message: "Email does not Exist" 
                });
            }
        }
    })
}


const getUser = (req,res)=>{
    User.findById(req.user._id, (err,data)=>{
        if(err){
            res.status(500).json({
                success:false,
                message:'An Error occured when fetching user Profile'
            })
        }else{
            res.json({
                success:true,
                data,
                message:'User profile fetched'
            })
        }
    })
}

module.exports = { register, login, getUser }


// async(err,data)=>{
//     if(err){
//         res.status(500).json({
//             success:false,
//             message:'An Error'
//         })
//     }else {
//        if(data){
//        const validPassword = await compare(password, data.password)
//         if(validPassword){
//                res.json({success: true,
//                  message:"signed in"
//                 });
//         }
//        }else{
//         res.send(data)
//         // res.send({status: false, message:"Email does not Exist"});
//        }
//     }
// }