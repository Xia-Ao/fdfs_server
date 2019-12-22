
const FdfsClient = require('fdfs');
const debug = require('debug')('fdfs');


const fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            host: '47.98.158.198',
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