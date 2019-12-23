const router = require('koa-router')();
const {
    getFileListController,
    getFileController,
    fileUpLoadController,
    fileBatchUploadController,
    fileDelController,
    fileBatchDelController,

} = require('../controller/fileUploadController.js');

router.prefix('/image');

// 获取图片列表
router.get('/list', getFileListController);

// 获取单个图片
router.get('/get', getFileController);

// 单张图片上传
router.post('/uoload_v1', fileUpLoadController);

// 删除单个图片
router.del('/del', fileDelController);

// 批量删除图片
router.del('/batch_del', fileBatchDelController);

module.exports = router;