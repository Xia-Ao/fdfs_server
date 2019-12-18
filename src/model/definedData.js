/*
 * @Author: ao.xia 
 * @Date: 2019-12-17 19:48:33 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-17 20:22:24
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

module.exports = definedData;