const multer = require('multer');


const path = require('path')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log(path.parse(file.originalname).name)
      cb(null, file.originalname)
    }
  })
 

module.exports = storage 