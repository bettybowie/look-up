const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');
//Meuler package needed to handle form data used to upload files
const multer = require('multer');

const upload = multer()

const cloudinary = require('../../utils/cloudinary');

// The `/api/posts` endpoint
router.get('/', async (req, res) => {
  try {
    const userData = await Post.findAll({
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE new post
//need to add cloudinary
router.post('/', withAuth, upload.single('file'), async (req, res) => {
  try {
    // Get the path for the uploaded image that is provided by the multer middleware
    console.log('req.file', req.file);
      const imagePath = req.file.path;
      console.log(imagePath)
    // upload the image to cloudinary
    const image = await cloudinary.uploader.upload(req.file.buffer.toString('base64'));

    console.log(image)
    const newPost = await Post.create({
      file_URL: req.session.file_URL,
      date_created: req.session.date_created,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost); ///returning data
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
