import express from 'express';

// import util functions
import upload from '../../config/multerConfig.js';

const router = express.Router();

// import controllers
import categoryController from '../../controllers/admin/categoryController.js';

// file upload
const uploadFields = upload.fields([{ name: 'categoryImage', maxCount: 1 }]);

router.get('/', categoryController.getCategoryList); // list all categories
router.get('/add', categoryController.getAddCategory); // add category
router.post('/add', uploadFields, categoryController.postAddCategory); // saving new category
router.post('/:id/delete', categoryController.deleteCategory); // delete category
router.get('/edit/:id', categoryController.editCategory); // edit category
router.post('/edit/:id', categoryController.postEditCategory); // post edit controller

// export router
export default router;
