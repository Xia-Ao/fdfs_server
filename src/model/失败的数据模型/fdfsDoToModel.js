/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:24:22 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-19 01:02:39
 */

const definedData = require('../definedData');
const {dateFormat} = require('../../common/utils.js');

class FdfsModel {
    constructor(model){
        definedData(this, 'fileName', model.file_name);
        definedData(this, 'fileType', model.file_type);
        definedData(this, 'extension', model.extension);
        definedData(this, 'filePath', model.path);
        definedData(this, 'size', () => {
            if (typeof model.size != 'number') {
                return 0;
            }
            return model.size;
        });
        definedData(this, 'createTime', () => {
            let time = model.create_time;
            if (!time) {
                return dateFormat(0);
            }
            return dateFormat(time);
        });
    }
}


module.exports = FdfsModel;