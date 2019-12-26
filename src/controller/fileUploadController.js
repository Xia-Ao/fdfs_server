
const {uploadService, batchUploadService} = require('../services/uploadFileService');
const getFileService = require('../services/getFileService');
const {deleteService, batchDeleteService} = require('../services/deleteFileService');
const responseModel = require('../model/resultData/responseModel');

/**
 * 获取文件列表
 */
const getFileListController = async (ctx) => {
    let params = ctx.request.query;
    let result = {...responseModel};
    result = await getFileService.getFileListService(params);
    ctx.body = result;
}

/**
 * 获取图片详情
 * @param {*} ctx 
 * @param {*} next 
 */
const getFileController = async (ctx) => {
    let {id} = ctx.request.query;
    let result = {...responseModel};
    result = await getFileService.getFileById(id);
    ctx.body = result;
}


/**
 * 图片上传
 * @param {*} ctx 
 * @param {*} next 
 */
const fileUpLoadController = async (ctx) => {

    let files = ctx.request.files;
    let result = {...responseModel};
    if (!files) {
        ctx.body = result;
        return 
    }
    result = await uploadService(files.file);
    ctx.body = result;
}


/**
 * 批量上传图片
 * @param {*} ctx 
 * @param {*} next 
 */
const fileBatchUpLoadController = async (ctx) => {

    let files = ctx.request.files;
    let result = {...responseModel};
    if (!files) {
        ctx.body = result;
        return 
    }
    result = await batchUploadService(files);
    ctx.body = result;
}

/**
 * 删除图片
 */
const fileDelController = async (ctx) => {
    let {id} = ctx.request.query;
    let result = {...responseModel};
    result = await deleteService(id);
    ctx.body = result;
}


/**
 * 批量删除图片
 */
const fileBatchDelController = async (ctx) => {
    let {ids} = ctx.request.query;
    let result = {...responseModel};
    if (!ids) {
        result.message = 'ids参数为空';
        ctx.body = result;
        return;
    }
    let idsArr = ids.split(',').map((id) => Number(id));
    result = await batchDeleteService(idsArr);
    ctx.body = result;
}


module.exports = {
    getFileController,
    getFileListController,
    fileUpLoadController,
    fileBatchUpLoadController,
    fileDelController,
    fileBatchDelController,
};
