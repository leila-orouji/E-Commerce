const { check } = require('express-validator');
const path = require("path");

class fileToField {
    handle(req,res,next){
        if (! req.file) req.body.image = undefined;
        else req.body.image = req.file.filename;
        next();
    }
}
module.exports = new fileToField();