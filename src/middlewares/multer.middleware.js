import multer from "multer";


const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename : function(req, file, cb){
        cb(null, file.originalname) //it is not a good practice as user can give multiple file with same name but here we just keep the file for small time before uploading to cloudinary then delete it
    }
})

export const upload = multer({
    storage
})