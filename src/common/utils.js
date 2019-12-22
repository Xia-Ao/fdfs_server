/*
 * @Author: ao.xia 
 * @Date: 2019-12-14 01:42:36 
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-18 21:28:21
 */
const isEmpty = data => data === '' || data === null || typeof data === 'undefined';

/**
 * 日期字符串格式处理
 * @param { String } str 字符串格式
 * @param { Number } yyyy 年
 * @param { Number } yy 年
 * @param { Number } M 月
 * @param { Number } w 周
 * @param { Number } d 日
 * @param { Number } h 小时
 * @param { Number } m 分
 * @param { Number } s 秒
 */
const dateStringFormat = (formatStr, {
    yyyy = 1970, yy = 70,
    M = 1,
    w = 0,
    d = 1,
    h = 0,
    m = 0,
    s = 0,
}) => {
    const doubleTime = time => (time <= 9 ? `0${time}` : time.toString());
    formatStr = formatStr.replace(/yyyy|YYYY/, yyyy)
        .replace(/yy|YY/, yy)
        .replace(/MM/, M)
        .replace(/M/g, M)
        .replace(/www|WWW/, `星期${w}`)
        .replace(/ww|WW/, `周${w}`)
        .replace(/w|W/g, w)
        .replace(/dd|DD/, doubleTime(d))
        .replace(/d|D/g, d)
        .replace(/hh|HH/, doubleTime(h))
        .replace(/h|H/g, h)
        .replace(/mm/, doubleTime(m))
        .replace(/m/g, m)
        .replace(/ss|SS/, doubleTime(s))
        .replace(/s/g, s);
    return formatStr;
};

/**
 * 处理Date类型字符串格式
 * @param {Date} date
 * @param {String} formatStr
 */
const dateFormat = (date, formatStr = 'yyyy-MM-dd hh:mm:ss') => {
    if (!(date instanceof Date)) {
        if (typeof date === 'number') {
            date = new Date(date);
        } else {
            throw TypeError('dateFormat error: date is not Date');
        }
    }
    try {
        const Week = ['日', '一', '二', '三', '四', '五', '六'];
        let str = formatStr;
        const yy = date.getYear() % 100;
        const M = date.getMonth() + 1;
        const w = Week[date.getDay()];
        const d = date.getDate();
        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();
        str = dateStringFormat(formatStr, {
            yyyy: date.getFullYear(), yy, M, w, d, h, m, s,
        });
        return str;
    } catch (e) {
        console.log(`Date to String error：${e}`);
        return date;
    }
};

/**
 * 处理Date的日期数值差
 * @param {Number} dateDiffNum 日期数值差
 * @param {String} formatStr 输出格式
 */
const dateDiffFormat = (dateDiffNum = 0, formatStr = 'd 天 hh 小时 mm 分钟 ss 秒') => {
    const SecondUnit = 1000;
    const MinutesUnit = 60 * SecondUnit;
    const HoursUnit = 60 * MinutesUnit;
    const DayUnit = 24 * HoursUnit;

    const d = Math.floor(dateDiffNum / DayUnit);
    dateDiffNum %= DayUnit;
    const h = Math.floor(dateDiffNum / HoursUnit);
    dateDiffNum %= HoursUnit;
    const m = Math.floor(dateDiffNum / MinutesUnit);
    dateDiffNum %= MinutesUnit;
    const s = Math.floor(dateDiffNum / SecondUnit);

    return dateStringFormat(formatStr, {
        d, h, m, s,
    });
}; 

const getFileExtension = (fileName = '') => {
    if (!fileName || typeof fileName !== 'string') {
        return '';
    }
    return fileName.split('.').pop().toLowerCase();
}

module.exports = {
    isEmpty,
    dateFormat,
    dateDiffFormat,
    getFileExtension
}