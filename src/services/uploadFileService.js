/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-01 21:24:19
*/
const fs = require('fs');
const fdfs = require('../common/fdfs');
const serviceResultModel = require('../model/resultData/serviceResultModel');
const fileDao = require('../dao/fdfsDoMapper');
const fdfsModelToDo = require('../model/fdfs/fdfsModelToDo');
const {getFileExtension, dateFormat} = require('../common/utils.js');
const getFileService = require('./getFileService');
const mime = require('../common/mime');

const FILE = 'file';
const BUFFER = 'buffer';
const STREAM = 'stream';

const uploadService = async (file) => {
    let result = serviceResultModel;

    // 1. 获取文件信息
    let modelData = {
        fileName: file.name,
        createTime: dateFormat(new Date().getTime()),
    };
    let fileType = '';

    // 2. 文件类型判断，对于buffer，File，stream类型单独处理
    if (file.size > 0) {
        // File对象
        fileType = FILE;
        modelData.extension = getFileExtension(file.name);
        modelData.fileType = file.type;
        modelData.size = file.size;
    } else if (file.buffer) {
        // Buffer
        fileType = BUFFER;
        modelData.extension = getFileExtension(file.name);
        modelData.fileType = mime(modelData.extension);
        modelData.size = file.buffer.data.length;
    } else if (file.stream) {
        // Stream
        fileType = STREAM;
        modelData.extension = getFileExtension(file.name);
        modelData.fileType = file.type;
        modelData.size = file.size;
    } else {
        return result;
    }

    if (!modelData.extension) {
        result.status = false;
        result.message = '获取文件名称出错';
        return result;
    }


    // 3. 上传fdfs    
    try {
        let fileBuffer
        switch (fileType) {
            case FILE:
                fileBuffer = fs.readFileSync(file.path);
                break;
            case BUFFER:
                fileBuffer = Buffer.from(file.buffer);
                break;
            case STREAM:
                fileBuffer = file.stream;
                break;
            default:
                return result;
        }
        let fileId = ''
        try {
            fileId = await fdfs.upload(fileBuffer, {
                ext: modelData.extension,
            });
        } catch (err) {
            console.warn(err);
            result.message = '上传fdfs出错，请稍后再试'
            return result;
        }
        // 校验fileId
        if (!fileId) {
            result.status = false;
            result.message = '上传fdfs出错，请稍后再试';
            return result;
        }
        modelData.filePath = fileId;

        // 4. 插入数据库
        // 4.1 model to Do
        let doData = fdfsModelToDo(modelData);

        // 4.2 insert
        let daoResult = await fileDao.insert(doData);
        if (daoResult && daoResult.insertId * 1 > 0) {
            let doData = await getFileService.getFileById(daoResult.insertId);

            if (!doData.status) {
                result = Object.assign(result, doData);
            }
            result.status = true;
            result.message = '图片上传成功';
            result.data = doData.data;

        } else {
            result.status = false;
            result.message = '数据库插入失败，请检查格式'
        }


    } catch (e) { // 抛出错误
        result.status = false;
        result.message = '上传图片发生错误，请稍后再试';
        return result;
    }

    return result;
}


const batchUploadService = (ctx) => {

}

module.exports = {
    uploadService,
    batchUploadService,
}