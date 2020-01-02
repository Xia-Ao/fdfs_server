const router = require('koa-router')();
const {
    getFileListController,
    getFileController,
    fileUploadController,
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
router.post('/uoload_v1', fileUploadController);

// 批量上传图片
router.post('/batch_upload_v1', fileBatchUploadController);

// 删除单个图片
router.del('/del', fileDelController);

// 批量删除图片
router.del('/batch_del', fileBatchDelController);

module.exports = router;