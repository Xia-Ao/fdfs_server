/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:26:59 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-14 01:27:39
 */


/**
 * 定义数据的get方法， 只允许数据的单向传递
 * @param {String} key 
 * @param {function | other} val 
 */
const definedData = (key, val) => {
    Object.defineProperty(this, key, {
        get() {
            if (typeof val !== 'function') {
                return val;
            } else {
                return val();
            }
        }
    })
};


class FdfsModel {
    constructor(doData){
        definedData('name', doData.name);
    }
}