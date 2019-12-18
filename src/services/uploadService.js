/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-18 09:57:32
*/
const fs = require('fs');
const path = require('path');
const fdfs = require('../common/fdfs');
const serviceResultModel = require('../model/resultData/serviceResultModel');
const fileUploadDao = require('../dao/fdfsDoMapper');
const FdfsDo = require('../model/fdfs/fdfsModelToDo');
const FdfsModel = require('../model/fdfs/fdfsDoToModel');


const uploadService = async (file) => {


    // 1. 获取文件信息
    let modelData = {
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        createTime: new Date().getTime(),
    };
   

    let result = serviceResultModel;

    // 2. 文件类型判断，对于buffer，File，stream类型单独处理


    // 3. 上传fdfs    
    try {
        let fileBuffer = Buffer.from(fs.readFileSync(file.path));
        console.log('buffer', fileBuffer);

        let fileId = await fdfs.upload(fileBuffer);
        console.log(fileId);
        // 校验fileId
        // if(!fileId) {
            
        // }
    modelData.path = fileId;

        // 4. 插入数据库
        // 4.1 model to Do
        let DoData = new FdfsDo(modelData);
        // 4.2 insert
        let sqlResult = await fileUploadDao.insert(DoData);

        // 4.3 Do to model
        

    } catch (e) { // 抛出错误
        console.log(e);
        result.status = false;
        result.message = '上传fdfs出错，请稍后再试';
    }

    // let readStream = fs.createReadStream(files.file.path);
    // let filePath = path.join(__dirname, '../../') + `/${files.img.name}`;

    // const upStream = fs.createWriteStream(filePath);
    // readStream.pipe(upStream);

    // let imgPath = path.resolve('hu.png');
    // console.log(path.resolve())
    // fdfs.upload(imgPath).then( (fileId) => {
    //     console.log(fileId)
    // })

    // 调用model，将数据转化

    // 调用dao层，将数据插入数据库
    
    

    return result;
}


module.exports = uploadService;