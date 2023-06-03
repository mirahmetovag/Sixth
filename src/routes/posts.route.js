const {Router} = require ('express');
const {create, getAll, update} = require ('../controllers/posts.controller');

const router = Router();

router.post('/create', create);
router.get('/posts', getAll);
router.put('/update', update);

module.exports = router;