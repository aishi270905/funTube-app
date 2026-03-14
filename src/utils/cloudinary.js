import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; // fs => file System, for managing whole file system(i.e, read, write, modify etc)


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (loaclFilePath) => {
 try{
  if(!loaclFilePath)
     return null;
  
  //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(loaclFilePath,{
    resource_type : "auto"
  });

  //file has been uploaded succesfully
  console.log("file has been uploaded on cloudinary", response.url);
  return response;
}catch(error){
  fs.unlinkSync(loaclFilePath)//remove the locally saved temporary file as the upload operation got failed
  return null;
}
}

export {uploadOnCloudinary};