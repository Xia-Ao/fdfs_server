/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-22 21:01:27
*/

const serviceResultModel = require('../model/resultData/serviceResultModel');
const fileDao = require('../dao/fdfsDoMapper');
const MESSAGE = require('../model/resultData/messageModel');
const fdfsDoToModel = require('../model/fdfs/fdfsDoToModel');


const getFileByFileId = async (fileId) => {
    let result = {...serviceResultModel};

    if (!fileId) {
        result.status = false,
            result.message = 'fileId 不能为空';
        return result;
    }

    let daoResult = await fileDao.selectByFileId(fileId);
    if (!daoResult) {
        result.message = MESSAGE.GET_DATA_FAIL;
        return result;
    }

    result.status = true;
    result.message = MESSAGE.GET_DATA_SUCCESS;
    result.data = fdfsDoToModel(daoResult);
    return result;
}

const getFileById = async (id) => {
    let result = {...serviceResultModel};

    if (!id) {
        result.status = false,
        result.message = 'id 不能为空';
        return result;
    }

    let daoResult = await fileDao.selectById(id);
    if (!daoResult) {
        result.message = MESSAGE.GET_DATA_FAIL;
        return result;
    }

    result.status = true;
    result.message = MESSAGE.GET_DATA_SUCCESS;
    result.data = fdfsDoToModel(daoResult);
    return result;
}


const getFileListService = async (params) => {
    let result = {...serviceResultModel};

    let daoResult = await fileDao.selectListByPage(params);

    if (Array.isArray(daoResult.list) && daoResult.list.length > 0) {
        daoResult.list = daoResult.list.map(item => fdfsDoToModel(item));
    } else {
        result.status = false;
        result.message = MESSAGE.GET_DATA_FAIL
        return result;
    }
    result.status = true;
    result.message = MESSAGE.GET_DATA_SUCCESS
    result.data = daoResult;
    return result;
}


module.exports = {
    getFileById,
    getFileByFileId,
    getFileListService,
};