const Post = require('../models/postModels')

let posts = []
const newPostPage =(req,res)=>{
    // res.render('newpost',{posts})
}

const createPost =(req,res)=>{
    console.log(req.file)
    const {title,category,more,date} = req.body
    //IF IMAGEPATH IS NOT REQUIRED//
    // let filename=''
    // if(req.file){
    //     console.log(req.file)
    //     filename = req.file.filename
    // }
    const {filename,path} = req.file
    console.log(req.file)
    Post.create({title,category,more,date,imagePath:filename,imageLink:path},(err,message)=>{
        if(err){
            res.status(500).json({
                success:false,
                message:'An error occured'
            })
        }else{
            res.json({
                success:true,
                data:message,
                message:'New Post Added Successfully'
            })
        }

    });
    // posts.push({title,category,more,date,file,imagePath:filename,imageLink:path})
    // try{
        // const Post.create({title,category,more,date,imagePath:filename,imageLink:path},(err,message)
    // }catch(error){
    //     console.log(error)
    // }
    // console.log(posts);
    // res.redirect('/all-post')
    // res.redirect('/new-post')
}

const deletePost =(req,res)=>{
    // const {index} = req.params;
    // console.log(index)
    // posts.splice(index,1)
    

//MONGODB DELETE
    const {_id} = req.params;
    // Post.findByIdAndDelete(_id,(err,result)=>{
    Post.deleteOne({_id},(err,result)=>{
    if(err){
        console.log('there is an error')
    }else{
        console.log('Deleted succesfully')
    }
    })
    res.redirect('/all-post')
        // console.log(req.body)
}

const editPost = (req,res)=>{
    const {_id} = req.params;
    // const post = posts.find((each,i)=>i==index)
    // if(post){
    //     res.render('edit',{index,post})
    // }else{
    // console.log(req.body)

    // res.render('edit')

    // }
    Post.findById(_id,(err,result)=>{
        if(err){
            console.log(err)
            res.send('There is an error')
        }else if(result){
            res.render('edit',{post:result})
        }else{
            res.redirect('allpost')
        }
    })
}

const updatePost = (req,res)=>{
    const {_id} = req.params;
    const {title, more, category, file, date} = req.body;
    Post.findByIdAndUpdate(_id,{title, more, category, file, date},(err,result)=>{
        if(err){
            console.log(err);
            res.send('Unable to update')
        }else{
            res.redirect('/all-post')
        }

    })
    // console.log(req.body.id)
    
}

const viewPost = (req,res)=>{
    const {_id} = req.params;
    Post.findOne({_id},(err,result)=>{
        if(err){
             console.log('error'+err)
    }else{
        // console.log(mes)
        // res.render('view',{posts:mes})
        res.render('view',{result})
    }
    })

}

// const getPost = (req,res)=>{
//     Post.find((err,mes)=>{
//         if(err){
//             console.log('error'+err)
//         }else{
//             // console.log(mes)
//             res.render('allpost',{posts:mes})
//         }
//     })
// }

const getPost = (req,res)=>{
    Post.find().then(mes=>{
                res.json({
                    success:true,
                    data:mes,
                    mes
                })
                // console.log(mes)
                // res.send({status:true, message:'still valid',userDetails:userDetails})
                //         console.log(result.email)
    }).catch(error=>{
            res.status(500).json({
                success:false,
                message:'Internal Server Error'
            })
    })
}
module.exports = {createPost,deletePost,editPost,updatePost,viewPost,getPost,newPostPage}