const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Product = require('../models/product')

exports.create = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          err: "Image could not uploaded",
        });
      }

      const { title, price, description } = fields;

      if (!title || !title.length) {
        return res.status(400).json({
          error: "title is required",
        });
      }
      if (!price || !price.length) {
        return res.status(400).json({
          error: "price is required",
        });
      }
      if (!description || !description.length) {
        return res.status(400).json({
          error: "title is required",
        });
      }

      let product = new Product();
      product.title = title
      product.price = price
      product.description = description

      if (files.photo) {
        if (files.photo.size > 20000000) {
          return res.status(400).json({
            error: "Image size should be less than 2 mb",
          });
        }
  
        product.photo.data = fs.readFileSync(files.photo.filepath);
        product.photo.contentType = files.photo.mimetype;
      }

      product.save((err,result)=>{
        if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          return res.status(200).json({
            message : 'Product successfully created'
          })
      })

  

    })

}

exports.list = (req,res,next) =>{
    Product.find({})
    .exec((err, data) => {
        if (err) {
          return res.json({
            error: err,
          });
        }
  
        res.json({
          products: data,
        });
      });
}

exports.read = (req,res,next) =>{
    const id = req.params.id

    Product.findOne({id}).exec((err,data)=>{
        if(err){
            return res.status(400).json({
              error : err
            })
          }
          res.json(data)
    })
}
exports.remove = (req,res,next) =>{
    const id = req.params.id

    Product.findOneAndRemove({id}).exec((err,data)=>{
        if(err){
            return res.status(400).json({
              error : err
            })
          }
          res.status(200).json({
            message : "product deleted successfully"
          })
    })
}

exports.update = (req,res,next) =>{
    const id = req.params.id

    Product.findOne({id}).exec((err,oldProduct)=>{
        if(err){
            return res.status(400).json({
              error : err
            })
          }
            let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            oldProduct = _.merge(oldProduct,fields)

            if (files.photo) {
                if (files.photo.size > 20000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 2mb in size'
                    });
                }
                oldProduct.photo.data = fs.readFileSync(files.photo.filepath);
                oldProduct.photo.contentType = files.photo.type;
            }

            oldProduct.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }
                // result.photo = undefined;
                res.status(200).json({
                    result : result,
                    message : "product updated successfully"
                });
            });

    })
    
})

}