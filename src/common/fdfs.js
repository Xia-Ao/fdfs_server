/*
 * @Author: ao.xia 
 * @Date: 2020-01-05 22:06:15 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-05 22:08:35
 */

const FdfsClient = require('fdfs');
const debug = require('debug')('fdfs');
const config = require('../../config');


const fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            host: config.address,
            port: 22122
        }
    ],
    // 默认超时时间10s
    timeout: 10000,
    // 当获取不到文件后缀时使用
    defaultExt: 'txt',
    // 日志
    logger: {
        log: debug
    },
    // charset默认utf8
    charset: 'utf8'
});

module.exports = fdfs;