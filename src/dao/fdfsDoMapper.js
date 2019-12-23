
const dbUtils = require('./DB/db-util');
const fdfsSQL = require('./SQL/fdfsSQL.js');


// fastdfs表sql操作
const fastdfsDoMapper = {


    /**
     * 插入数据
     */
    async insert(doData) {
        let result = await dbUtils.insertData('image', doData)
        return result;
    },

    async selectById(id) {
        let _sql = fdfsSQL.selectById(id);
        let result = await dbUtils.query(_sql);
        if (Array.isArray(result) && result.length > 0) {
            return result[0];
        }
        return null;
    },

    async selectByFileId(fileId) {
        let _sql = fdfsSQL.selectByFileId(fileId);
        let result = await dbUtils.query(_sql);
        if (Array.isArray(result) && result.length > 0) {
            return result[0];
        }
        return null;
    },

    async selectListByPage({page = 1, pageSize = 10}) {
        var start = (page - 1) * pageSize;
        let result = await dbUtils.query(fdfsSQL.getList(start, pageSize));
        let total = result[0][0].total || 0;
        let list = result[1];
        return {
            total,
            page,
            pageSize,
            list,
        };
    },


    async deleteById(id) {
        let result = await dbUtils.deleteDataById('image', id)
        return result;
    },


    async updateById(id) {

    },

    
}

module.exports = fastdfsDoMapper;