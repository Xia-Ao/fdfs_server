const fs = require('fs');
const path = require('path');
const fdfs = require('../common/fdfs');

const uploadService  = require('../services/uploadService');

/**
 * 获取文件列表
 */
const getFileListController = async (ctx, next) => {
    
}


/**
 * 图片上传
 * @param {*} ctx 
 * @param {*} next 
 */
const fileUpLoadController = async (ctx, next) => {

    let files = ctx.request.files;


    // let readStream = fs.createReadStream(files.img.path);
    // let filePath = path.join(__dirname, '../../') + `/${files.img.name}`;

    // const upStream = fs.createWriteStream(filePath);
    // readStream.pipe(upStream);

    // let imgPath = path.resolve('hu.png');
    let result = await uploadService(files.file);

    ctx.body = result
}


/**
 * 删除图片
 */
const fileDelController = async (ctx, next) => {
    
}



module.exports = {
    fileUpLoadController,
    getFileListController,
    fileDelController
};
