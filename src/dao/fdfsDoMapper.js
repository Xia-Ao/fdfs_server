
const dbUtils = require('./DB/db-util');
const SQL = require('./SQL/fdfsSQL.js');


// fastdfs表sql操作
const fastdfsDoMapper = {


    /**
     * 插入数据
     */
    async insert(data) {
        let _sql = SQL.insert(data);
        let result = await dbUtils.query(_sql)
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result;
    },

    async deleteById(id) {

    },


    async updateById(data) {

    },

    async selectById(id) {

    },

    async selectListByPage(page, pageSize) {

    }

    
}

module.exports = fastdfsDoMapper;