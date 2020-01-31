/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:24:22 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-26 17:06:33
 */

const {dateFormat} = require('../../common/utils.js');

const fdfsDoToModel = (data) => {

    let _getId = id => id ? id : null;

    let _getFileName = name => name;

    let _getFileType = type => type;

    let _getPath = path => path;

    let _grtUrl = path => `http://img.xiaao.xin/${path}`;

    let _getExtension = extension => extension;

    let _getSize = (size) => {
        if (typeof size != 'number') {
            return 0;
        }
        return size;
    }

    let _getCreateTime = (time) => {
        if (!time) {
            return dateFormat(0);
        }
        return dateFormat(time);
    }

    return {
        id: _getId(data.id),
        fileName: _getFileName(data.file_name),
        fileType: _getFileType(data.file_type),
        extension: _getExtension(data.extension),
        filePath: _getPath(data.path),
        size: _getSize(data.size),
        url: _grtUrl(data.path),
        createTime: _getCreateTime(data.create_time)
    }
}


module.exports = fdfsDoToModel;