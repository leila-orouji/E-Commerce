const { check } = require('express-validator');

class redirectIfNoAdmin {
    handle(req, res, next){
       if(req.session.userId) 
            next();
       else res.redirect('/signin');
    }
}
module.exports = new redirectIfNoAdmin();