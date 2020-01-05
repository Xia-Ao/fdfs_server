/*
 * @Author: ao.xia 
 * @Date: 2020-01-05 22:05:55 
 * @Last Modified by:   ao.xia 
 * @Last Modified time: 2020-01-05 22:05:55 
 */
const mysql = require('mysql');
const async = require('async');

const {database: dbConfig = {}} = require('../../../config');

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    multipleStatements: true,
})

/**
 * 事务处理
 * @param {*} sqlparamsEntities 
 * @param {*} callback 
 */
const execTransaction = (sqlparamsEntities) => new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            reject(err);
            return;
        }
        connection.beginTransaction(function (err) {
            if (err) {
                reject(err);
                return;
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    connection.query(sql, param, function (tErr, rows, fields) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                throw tErr;
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err, result) {
                console.log("transaction error: " + err);
                if (err) {
                    connection.rollback(function (err) {
                        console.log("transaction error: " + err);
                        connection.release();
                        reject(err);
                        return;
                    });
                } else {
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                connection.release();
                                reject(err);
                                return;
                            });
                        } else {
                            connection.release();
                            resolve(info);
                        }
                    })
                }
            })
        });
    });
});


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
    execTransaction,
    createTable,
    findDataById,
    findDataByPage,
    deleteDataById,
    insertData,
    updateData,
    select,
    count,
}
