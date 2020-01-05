/*
 * @Author: ao.xia 
 * @Date: 2019-12-17 19:48:33 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2020-01-05 22:09:13
 */ 

/**
 * 定义数据类型
 * @param {Object} obj 定义对象 
 * @param {String} key key值
 * @param {any} val 
 */
const definedData = (obj, key, val) => {
    Object.defineProperty(obj, key, {
        get() {
            if (!val) {
                return null;
            }else if (typeof val !== 'function') {
                return val;
            } else {
                return val();
            }
        }
    })
};

module.exports = definedData;