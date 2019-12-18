/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:24:22 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-17 21:27:47
 */

const definedData = require('../definedData');
const {dateFormat} = require('../../common/utils.js');

class FdfsModel {
    constructor(model){
        definedData('fileName', model.file_name);
        definedData('fileType', model.file_type);
        definedData('filePath', model.path);
        definedData('size', () => {
            if (typeof model.size != 'number') {
                return 0;
            }
            return model.size;
        });
        definedData('createTime', () => {
            let time = model.create_time;
            if (!timeStr) {
                return dateFormat(0);
            }
            return dateFormat(time);
        });
    }
}


module.exports = FdfsModel;