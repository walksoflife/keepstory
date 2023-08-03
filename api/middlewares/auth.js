// import createError from "http-errors"
// import { isLogout } from "../auth/index.js";
// import { SESSION_ABSOLUTE_TIMEOUT } from "../configs/index.js";

// export const authorized = (req, res, next) => {
//     if(!req.session?.user){
//         return next(createError.Unauthorized('You must be logged in'))
//     }
//     return next();
// } 

// export const guest = (req, res, next) => {
//     if(req.session?.user){
//         return next(createError.Unauthorized('You already logged in'))
//     }
//     return next();
// }

// export const statusActive = async (req, res, next) => {
//     if(req.session?.user){
//         const now = new Date(Date.now())
//         const {createAt} = req.session.user;

//         if(now > createAt + SESSION_ABSOLUTE_TIMEOUT){
//             await isLogout(req, res);

//             return next(createError.Unauthorized('You must be logged in'))
//         }
//     }
//     return next();
// }
