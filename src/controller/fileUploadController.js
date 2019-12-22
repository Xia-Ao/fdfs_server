
const uploadService = require('../services/uploadService');
const getFileService = require('../services/getFileService');
const fileDelService = require('../services/fileDelService');
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
 * 删除图片
 */
const fileDelController = async (ctx) => {
    let {id} = ctx.request.query;
    let result = {...responseModel};
    result = await fileDelService(id);
    ctx.body = result;
}



module.exports = {
    fileUpLoadController,
    getFileController,
    getFileListController,
    fileDelController
};
