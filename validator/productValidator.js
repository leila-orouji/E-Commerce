const { check } = require('express-validator');
const path = require("path");

class productValidation {
    handle(){
        return [
            check('title')
            // .trim()
            .isLength({ min: 3, max:40})
            .withMessage('title is empty')
            ,
            check('price')
            // .trim()
            .toFloat()
            .isFloat({min:1})
            .withMessage('price is empty') 
            ,
            check('image')   
            .custom(async (value)=>{
                if (!value) throw new Error('No Image!');
                const fileExt = ['.png', '.jpg', '.jpeg', '.svg'];
                if (!fileExt.includes(path.extname(value)))  throw new Error('not support file');
            })
                  
        ]
    }
}
module.exports = new productValidation();