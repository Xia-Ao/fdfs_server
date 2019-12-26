
module.exports = {
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

