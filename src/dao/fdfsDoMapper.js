
const dbUtils = require('../common/utils/db-util');
const SQL = require('./SQL/fdfsSQL.js');


// fastdfs表sql操作
export default fastdfsDoMapper = {


    /**
     * 插入数据
     */
    insert(data) {
        let _sql = SQL.insert(data);
        let result = await dbUtils.query(_sql)
        if (Array.isArray(result) && result.length > 0) {
            result = result[0]
        } else {
            result = null
        }
        return result;
    },

    deleteById(id) {

    },


    updateById(data) {

    },

    selectById(id) {

    },

    selectListByPage(page, pageSize) {

    }

    
}