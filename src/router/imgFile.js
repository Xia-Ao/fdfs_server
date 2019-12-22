const router = require('koa-router')();
const {
    getFileListController,
    getFileController,
    fileUpLoadController,
    fileDelController,

} = require('../controller/fileUploadController.js');

router.prefix('/upload');

router.get('/img_list', getFileListController);

router.get('/get_img', getFileController);

router.post('/img_uoload_v1', fileUpLoadController);

router.del('/img_del', fileDelController);

module.exports = router;