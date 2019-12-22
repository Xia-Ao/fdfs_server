/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-22 21:32:33
*/
const serviceResult = require('../model/resultData/serviceResultModel');
const fileDao = require('../dao/fdfsDoMapper');
const getFileService = require('./getFileService');
const fdfs = require('../common/fdfs');

const uploadService = async (id) => {

    let result = {...serviceResult};

    // 1. 入参判断
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


module.exports = uploadService