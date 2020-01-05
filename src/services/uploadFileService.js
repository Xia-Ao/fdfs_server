/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-05 21:52:51
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

const _getFileInfo = (file) => {
    // 定义文件数据模型
    let modelData = {
        fileName: file.name,
        createTime: dateFormat(new Date().getTime()),
    };

    // 2. 文件类型判断，对于buffer，File，stream类型单独处理
    if (file.size > 0) {
        // File对象
        modelData = Object.assign(modelData, {
            fileObj: FILE,
            extension: getFileExtension(file.name),
            fileType: file.type,
            size: file.size,
            _data: file.path,
        });
    } else if (file.buffer) {
        // Buffer
        modelData = Object.assign(modelData, {
            fileObj: BUFFER,
            extension: getFileExtension(file.name),
            fileType: mime(modelData.extension),
            size: file.buffer.data.length,
            _data: file.buffer
        });
    } else if (file.stream) {
        // Stream
        modelData = Object.assign(modelData, {
            fileObj: STREAM,
            extension: getFileExtension(file.name),
            fileType: file.type,
            size: file.size,
            _data: file.stream,
        });
    } else {
        modelData = {};
    }

    return modelData;
}

/**
 * 单文件上传service
 * @param {Object} file 
 * @returns {Object} result 
 */
const uploadService = async (file) => {
    let result = serviceResultModel;

    // 1. 获取文件数据模型
    let modelData = _getFileInfo(file);

    if (!modelData.fileName || !modelData.extension) {
        result.status = false;
        result.message = '获取文件名称出错';
        return result;
    }


    // 3. 上传fdfs    
    try {
        let fileBuffer
        switch (modelData.fileObj) {
            case FILE:
                fileBuffer = fs.readFileSync(modelData._data);
                break;
            case BUFFER:
                // eslint-disable-next-line no-undef
                fileBuffer = Buffer.from(modelData._data);
                break;
            case STREAM:
                fileBuffer = modelData._stream;
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
        delete modelData._data;

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


/**
 * 多文件上传service
 * @param {Array} files 文件列表
 * @returns {Object} result 结果状态
 */
const batchUploadService = async (files) => {
    let result = serviceResultModel;

    // 1. 文件列表非空判断， 初始化文件列表处处对象
    if (!(Array.isArray(files) && files.length > 0)) {
        result.message = '文件列表为空';
        return result;
    }
    let fileList = [];
    let successList = [];
    let failList = [];
    let promiseList = [];

    // 2. 遍历列表，获取文件数据对象
    files.map((file) => {
        let modelData = _getFileInfo(file);
        if (!modelData.fileName || !modelData.extension) {
            failList.push(modelData.fileName);  // 失败列表
        } else {
            fileList.push(modelData);           // 待上传列表
        }
    });


    // 3. 上传fdfs
    fileList.map((modelData) => {
        let promise = new Promise((resolve, reject) => {
            // modelData.filePath = 'image/M00/00/00/L2Kexl3_JnqAbIVTAAA0Ejsn-Wc190.png';
            // resolve(modelData);
            try {
                let fileBuffer
                switch (modelData.fileObj) {
                    case FILE:
                        fileBuffer = fs.readFileSync(modelData._data);
                        break;
                    case BUFFER:
                        // eslint-disable-next-line no-undef
                        fileBuffer = Buffer.from(modelData._data);
                        break;
                    case STREAM:
                        fileBuffer = modelData._data;
                        break;
                    default:
                        return result;
                }
                let failNum = 0;
                fdfs.upload(fileBuffer, {
                    ext: modelData.extension,
                }).then((fileId) => {
                    if (!fileId) {
                        failNum++;
                        failList.push(modelData.fileName);  // 失败列表
                    } else {
                        modelData.filePath = fileId;
                        delete modelData._data;
                        resolve(modelData);
                    }
                }).catch(() => {
                    failNum++;
                    failList.push(modelData.fileName);      // 失败列表
                    // 如果都是失败状态，将 promise 状态置为fulfilled
                    if (failNum === fileList.length) {
                        reject();
                    }
                })
            } catch (err) {
                console.warn(err);
                reject();
            }
        });
        promiseList.push(promise);
    })

    // 4. 批量插入数据库
    try {
        let res = await Promise.all(promiseList);
        successList = [...res];


        // 4. 插入数据库
        // 4.1 model to Do
        let doList = [];
        successList.forEach(modelData => {
            doList.push(fdfsModelToDo(modelData));
        })

        // 4.2 insert
        try {
            await fileDao.insertMultiple(doList);
            // 插入成功
            let fileIds = [];
            doList.map((doData) => {
                fileIds.push(doData.path);
            })
            let uploadResult = await getFileService.getFileListByFileIds(fileIds)
            successList = uploadResult.data;
            result.status = true;
        } catch (err) {
            // 插入数据库失败，同时需要删除fastdfs中的已上传的文件
            let delList = [];
            successList.forEach((item) => {
                let task = new Promise((resolve, reject) => {
                    try {
                        // 删除
                        fdfs.del(item.filePath).then((res) => {
                            if (!res) {
                                resolve(item)
                            } else {
                                failList.push(item.id);
                            }
                        }).catch(() => {
                            failList.push(item.id);
                            // 如果都是失败状态，将 promise 状态置为fulfilled
                            if (failList.length === fileList.length) {
                                reject();
                            }
                        });
                    } catch (err) {
                        console.warn('fdfs删除图片遇到未知错误', err);
                        reject();
                    }
                });
                delList.push(task);
                failList.push(item.fileName);
            });
            try {
                await Promise.all(delList);
            } catch (err) {
                console.warn('fdfs删除已上传文件失败', err);
            }
            // 清空列表
            successList = [];
            // 返回结果
            result.status = false;
        }
        result.message = `成功上传${successList.length}张图片， 失败${failList.length}张`,
            result.data = {
                successList,
                failList,
            };

    } catch (e) { // 抛出错误
        result.status = false;
        result.message = '上传图片发生错误，请稍后再试';
        return result;
    }

    return result;
}

module.exports = {
    uploadService,
    batchUploadService,
}