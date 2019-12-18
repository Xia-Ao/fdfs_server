const router = require('koa-router')();
const {
    getFileListController,
    fileUpLoadController,
    fileDelController,
} = require('../controller/fileUploadController.js');

router.prefix('/upload');

router.get('/img_list', getFileListController);

router.post('/img_uoload_v1', fileUpLoadController);

router.post('/img_del', fileDelController);

module.exports = router;