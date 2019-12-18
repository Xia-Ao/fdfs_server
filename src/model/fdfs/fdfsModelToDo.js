/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:26:59 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-17 21:30:20
 */

const definedData = require('../definedData');


class FdfsDo {
    constructor(doData){
        definedData('file_name', doData.fileName);
        definedData('file_type', doData.fileType);
        definedData('path', doData.filePath);
        definedData('size', () => {
            if (typeof doData.size != 'number') {
                return 0;
            }
            return doData.size;
        });
        definedData('create_time', () => {
            let timeStr = doData.createTime;
            if (!timeStr) {
                return 0;
            }
            return new Date(timeStr).getTime();
        });
    }
}

module.exports = FdfsDo;