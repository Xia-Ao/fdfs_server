const fs = require('fs');
const path = require('path');
const fdfs = require('../common/fdfs');

/**
 * 获取图片列表
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
    // console.log(files);

    let readStream = fs.createReadStream(files.img.path);
    let filePath = path.join(__dirname, '../../') + `/${files.img.name}`;

    const upStream = fs.createWriteStream(filePath);
    readStream.pipe(upStream);

    let imgPath = path.resolve('hu.png');
    // console.log(path.resolve())
    // fdfs.upload(imgPath).then( (fileId) => {
    //     console.log(fileId)
    // })

    fdfs.listGroups().then(function(groups) {
        console.log('groups', groups);
    }).catch(function(err) {
        console.error(err);
    }); 

    fdfs.getFileInfo('image/M00/00/00/rBCJy13rZ1CAHVThAAAPs22X_E8275.png').then((fileInfo) => {
        console.log('fileinfo',fileInfo);
    })

    fdfs.listStorages('image').then((storages) => {
        console.log('storages', storages);
    }).catch( (err) => {
        console.error(err);
    });


    ctx.body = 'img 上传成功'
}






module.exports = {
    fileUpLoadController,
};
