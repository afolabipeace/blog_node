const validatePost = (req,res,next)=>{
    const {index} = req.params;
    if(index == 0){
        res.redirect('/new-post')
    }else{
        next();
    }
}

module.exports= {validatePost}