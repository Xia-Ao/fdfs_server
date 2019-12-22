/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:26:59 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-21 17:23:30
 */

const definedData = require('../definedData');

class FdfsDo {
    constructor(doData){
        this.init(doData);
    }
    init(data) {
        definedData(this, 'file_name', data.fileName);
        definedData(this, 'file_type', data.fileType);
        definedData(this, 'extension', data.extension);
        definedData(this, 'path', data.filePath);
        definedData(this, 'size', () => {
            if (typeof data.size != 'number') {
                return 0;
            }
            return data.size;
        });
        definedData(this, 'create_time', () => {
            let timeStr = data.createTime;
            if (!timeStr) {
                return 0;
            }
            return new Date(timeStr).getTime();
        });
    }
    getData () {
        return this
    }
}

module.exports = FdfsDo;