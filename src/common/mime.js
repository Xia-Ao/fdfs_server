/*
 * 文件MIME匹配类型
 * @Author: ao.xia 
 * @Date: 2020-01-01 20:38:11 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-01 20:39:16
 */
// 定义常用类型
const mimeTypes = {
    // 基本类型
    js: 'application/x-javascript',
    html: 'text/html;charset=utf-8',
    htm: 'text/html;charset=utf-8',
    xml: 'text/xml;charset=utf-8',
    css: 'text/css;charset=utf-8',
    txt: 'text/plain;charset=utf-8',
    // 图片
    jpg: 'image/jpeg',
    jepg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    tif: 'image/tiff',
    ico: 'image/x-icon',

    // 音视频
    mp4: 'video/mp4',
    wave: 'video/wave',
    mp3: 'video/mp3',
    
    // 其他文本类型 
    text: 'text/plain',
    zip: 'application/zip',
    ttf: 'font/ttf',
    woff: 'font/woff',
    woff2: 'font/woff2',
}

module.exports = (extension) => {
    if (!extension) {
        return ''
    }
    return mimeTypes[extension] || mimeTypes['txt'];
}