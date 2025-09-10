import jwt from "jsonwebtoken";

const authUser = async(req, res, next) =>{
    const {accessToken} = req.cookies;
    if(!accessToken) return res.status(401).json({message:"unauthorized"});

    try{
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = decoded.id;
        
        next();
    }
    catch(err){
        console.error(err);
        res.json({message:"error in auth middleware"});
    }

}

export default authUser;