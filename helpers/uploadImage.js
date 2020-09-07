const fs = require('fs');
const multer = require('multer');
// Using mkdirp package 
const mkdirp = require('mkdirp')

function getDir(){
    let year = new Date().getFullYear();
    let month = new Date().getMonth()+1;
    let day = new Date().getDay();
    let dir = `./public/uploads/images/${year}/${month}/${day}`
    return dir;
};
const ImageStorage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        mkdirp.sync(getDir());
        cb(null, getDir());
    },
    filename: (req, file, cb) => { 
        let filePath =  getDir()+'/'+file.originalname;
        if(!fs.existsSync(filePath))
            cb(null,file.originalname);
        else
           cb(null, Date.now()+'-'+file.originalname);
         }
})

const upload = multer({ storage: ImageStorage });



module.exports = upload;