const { database: dbConfig = {} } = require('../../../config');
const mysql = require('mysql');

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    multipleStatements: true,
})

/**
 * 查询value
 * @param {*} sql 
 * @param {*} values 
 */
const query = (sql, values) => new Promise((resovle, reject) => {
    pool.getConnection((err, connection) => {
        if (err) {
            resovle(err);
        } else {
            connection.query(sql, values, (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resovle(rows);
                }
                connection.release();
            })
        }
    });
})

const createTable = (sql) => query(sql, []);


const findDataById = (table, id) => {
    let _sql = "SELECT * FROM ?? WHERE id = ? "
    return query(_sql, [table, id, start, end])
}


const findDataByPage = function (table, keys, start, end) {
    let _sql = "SELECT ?? FROM ??  LIMIT ? , ?"
    return query(_sql, [keys, table, start, end])
}


const insertData = (table, values) => {
    let _sql = "INSERT INTO ?? SET ?"
    return query(_sql, [table, values])
}


const updateData = function (table, values, id) {
    let _sql = "UPDATE ?? SET ? WHERE id = ?"
    return query(_sql, [table, values, id])
}


const deleteDataById = function (table, id) {
    let _sql = "DELETE FROM ?? WHERE id = ?"
    return query(_sql, [table, id])
}


const select = function (table, keys) {
    let _sql = "SELECT ?? FROM ?? "
    return query(_sql, [keys, table])
}

const count = function (table) {
    let _sql = "SELECT COUNT(*) AS total_count FROM ?? "
    return query(_sql, [table])
}

module.exports = {
    query,
    createTable,
    findDataById,
    findDataByPage,
    deleteDataById,
    insertData,
    updateData,
    select,
    count,
}
