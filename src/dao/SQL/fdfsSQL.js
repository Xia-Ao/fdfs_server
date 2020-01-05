/*
 * @Author: ao.xia 
 * @Date: 2020-01-05 22:05:47 
 * @Last Modified by:   ao.xia 
 * @Last Modified time: 2020-01-05 22:05:47 
 */

module.exports = {

    insertMultiple(table, doDatas) {
        let sqlArr = [];
        doDatas.forEach((data) => {
            sqlArr.push({
                sql: `INSERT INTO ?? SET ?`,
                params: [table, data],
            })
        })
        return sqlArr;
    },

    selectByFileId(fileId) {
        return `SELECT * FROM image WHERE path = ${fileId} `
    },

    selectById(id) {
        return `SELECT * FROM image WHERE id = ${id} `
    },

    selectByIds(ids) {
        let idsStr = ids.join(', ');
        return `SELECT * FROM image WHERE id IN (${idsStr})`
    },
    
    selectByFileIds(fileIds) {
        fileIds = [...fileIds.map((fileId) => `'${fileId}'`)];
        let idsStr = fileIds.join(', ');
        return `SELECT * FROM image WHERE path IN (${idsStr})`
    },

    getList(start, pageSize) {
        return `
            SELECT COUNT(*) AS total FROM image;
            SELECT * FROM image ORDER BY create_time DESC limit ${start}, ${pageSize}
        `
    },

    deleteByIds(ids) {
        let idsStr = ids.join(', ');
        return `DELETE FROM image WHERE id IN (${idsStr})`
    },
}

