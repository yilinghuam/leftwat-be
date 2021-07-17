require('dotenv').config()
const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const uploadController = require('../controllers/upload_controller')
const { 
    authenticatedOnly : authenticatedOnlyMiddleware 
} = require('../middlewares/auth_middlewares')

// --> MULTER ROUTE FOR LOCAL STORAGE
// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '.pdf')
//   }
// })
// let upload = multer({ storage: storage })

// --> MULTER-STORAGE-CLOUDINARY ROUTE FOR CLOUDINARY STORAGE
const receiptUploadStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'leftwat',
      format: async (req, file) => 'png',
    },
})

const uploadReceiptParser = multer({ storage: receiptUploadStorage })

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
})

// ==============================
//            ROUTES
// ==============================
//index route (nopoint)
// router.get('/', uploadController.index)

// upload receipt route
// --> MULTER ROUTE FOR LOCAL STORAGE
// router.post('/upload', upload.single('testReceipt'), itemController.uploadReceipt)
// --> MULTER-STORAGE-CLOUDINARY ROUTE FOR CLOUDINARY STORAGE
router.post('/', authenticatedOnlyMiddleware, uploadReceiptParser.single('receipt'), uploadController.uploadReceipt)

// confirm receipt route
router.post('/confirm', authenticatedOnlyMiddleware, uploadController.confirmReceipt)

module.exports = router