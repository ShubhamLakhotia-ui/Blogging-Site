const {validateToken}=require("../services/authentication");

function checkForAuth(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
           return next();
        }

        try{

            const userPayload=validateToken(tokenCookieValue);
            req.user=userPayload;
            console.log("Auth",req.user);
        }
        catch(error){}
        return next();
    }

}
module.exports={checkForAuth};