/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-26 22:47:31
*/
const serviceResult = require('../model/resultData/serviceResultModel');
const fileDao = require('../dao/fdfsDoMapper');
const getFileService = require('./getFileService');
const fdfs = require('../common/fdfs');
const fdfsDoToModel = require('../model/fdfs/fdfsDoToModel');

const deleteService = async (id) => {

    let result = {...serviceResult};

    // 1. 入参校验
    if (!id) {
        result.message = 'id 不能为空';
    }

    // 2. 通过id获取详细fileId
    let fileResult = await getFileService.getFileById(id);
    let fileId;
    if (fileResult.status && fileResult.data && fileResult.data.filePath) {
        fileId = fileResult.data.filePath;
    } else {
        result = Object.assign(result, fileResult);
        return result;
    }

    // 3. 在fdfs中删除文件
    let fdfsResult;
    try {
        fdfsResult = await fdfs.del(fileId);
    } catch (err) {
        if (err) {
            result.status = false;
            result.message = 'fdfs 删除文件失败';
            return result;
        }
    }

    // 4. 数据库表更新
    if (!fdfsResult) {
        let delResult = await fileDao.deleteById(id);
        if (delResult && +delResult.affectedRows > 0) {
            result.status = true;
            result.message = '删除成功',
                result.data = fileResult.data;
        } else {
            result.message = '数据库删除失败';
        }

    }

    return result;
}

const batchDeleteService = async (ids) => {
    let result = {...serviceResult};

    // 1. 入参校验
    if (!(Array.isArray(ids) && ids.length > 0)) {
        result.message = '删除列表ids为空';
        return result
    }
    // 检查是否有重复
    if ([...new Set(ids)].length !== ids.length) {
        result.message = '删除列表有重复元素';
        return result
    }


    // 2. 创建批量删除列表
    let fileList = [];  // 文件信息列表
    let delList = []; // promise task列表
    let successList = []; // 删除成功列表
    let failList = [];  // 删除失败id列表


    // 3. 获取文件fileId
    let fileResult = await fileDao.selectByIds(ids);
    if (Array.isArray(fileResult) && fileResult.length > 0) {
        fileList = fileResult.map(item => fdfsDoToModel(item));
    } else {
       fileList = [];
    }
    if (fileList.length <= 0) {
        result.message = '删除文件列表id不存在，请检查';
        return result;
    }
    // 查看是否有未找到的id 
    if (ids.length !== fileList.length) {
        let tempA = [...ids];
        let tempB = fileList.map(item => item.id);
        let diff = tempA.concat(tempB).filter(v => !tempA.includes(v) || !tempB.includes(v));
        failList = [...diff];
    }

    // 4. 并行异步在fdfs中删除文件
    fileList.map((item) => {
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
        })
        delList.push(task);
    })

    // 5. 处理异步删除结果, 更新数据库
    try {
        let res = await Promise.all(delList);
        successList = [...res];

        // 更新数据库
        let successIds = [];
        successList.map((item) => {
            successIds.push(item.id);
        });
        if (successIds.length <= 0) {
            result.message = '删除发生错误';
            return result;
        }
        try {
            let delResult = await fileDao.deleteByIds(successIds);
            if (delResult && +delResult.affectedRows > 0) {
                result.status = true;
                result.message = `成功删除${successList.length}张图片， 失败${failList.length}张`,
                result.data = {
                        successList,
                        failList,
                    };
            } else {
                result.message = '数据库删除失败';
                return result;
            }
        } catch (err) {
            console.warn('数据库删除图片遇到未知错误', err);
        }
        

    } catch (err) {
        console.warn('删除图片遇到未知错误', err);
        result.message = `成功删除${successList.length}张图片， 失败${failList.length}张`,
        result.data = {
            successList,
            failList,
        }
        return result;
    }
    return result;
}




module.exports = {
    deleteService,
    batchDeleteService,
}