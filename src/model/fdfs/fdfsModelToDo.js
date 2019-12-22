/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:26:59 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-21 17:30:55
 */

const fdfsModelToDo = (model) => {
    
    let _getFileName = name => name;

    let _getFileType = type => type;

    let _getPath = path => path;

    let _getExtension = extension => extension;

    let _getSize = (size) => {
        if (typeof size != 'number') {
            return 0;
        }
        return size;
    }

    let _getCreateTime = (time) => {
        let timeStr = time;
        if (!timeStr) {
            return 0;
        }
        return new Date(timeStr).getTime();
    }

    return {
        file_name: _getFileName(model.fileName),
        file_type: _getFileType(model.fileType),
        extension: _getExtension(model.extension),
        path: _getPath(model.filePath),
        size: _getSize(model.size),
        create_time: _getCreateTime(model.createTime)
    }
}

module.exports = fdfsModelToDo;