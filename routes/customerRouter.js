var express = require('express');
var router = express.Router();
const customerModel = require('../model/customerModel')
var multer = require("multer")

//muter 
let storage = multer.diskStorage({
  destination: function(req,res, cb){
    cb(null, './public/images')
  },
  filename: function(req, file , cb){
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})

/* GET home page. */
router.get('/', async function(req, res, next) {
  let customer = await customerModel.find({})
  res.render('customer/index', { customer:customer });
});

const upload = multer({storage: storage});

router.get('/create',(req,res)=>{
  res.render('customer/create') 
})

router.post('/create', upload.single('image'), async(req, res)=>{
  const body = req.body
  let file = req.file
  let cust = new customerModel({
    fullname: body.fullname,
    email: body.email,
    phone: body.phone,
    image:file.filename
  })
  await cust.save()
  res.redirect('/customer')

})

router.get('/update/:id', async(req,res)=>{
  const customers = await customerModel.findById(req.params.id)
  res.render('customer/update',{customers}) 
})

router.post('/update/:id', upload.single('image'), async(req, res)=>{
  const body = req.body
  let file = req.file
  if(!file){
    await customerModel.findByIdAndUpdate(req.body.id,req.body)
    res.redirect('/customer')
  }
  else{
    let cust = new customerModel({
      _id: body.id,
      fullname: body.fullname,
      email: body.email,
      phone: body.phone,
      image:file.filename
    })
    await customerModel.findByIdAndUpdate(req.body.id,cust)
  res.redirect('/customer')
  }
  
  router.get('/delete/:id', async (req,res)=>{
    await customerModel.findByIdAndDelete(req.params.id)
    res.redirect('/customer')
  })

})

module.exports = router;