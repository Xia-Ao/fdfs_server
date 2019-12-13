/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-12 21:01:34
*/

const uploadService = async (file) => {

    let result = await uploadDao();

    let readStream = fs.createReadStream(files.img.path);
    let filePath = path.join(__dirname, '../../') + `/${files.img.name}`;

    const upStream = fs.createWriteStream(filePath);
    readStream.pipe(upStream);

    let imgPath = path.resolve('hu.png');
    // console.log(path.resolve())
    // fdfs.upload(imgPath).then( (fileId) => {
    //     console.log(fileId)
    // })

    // 调用model，将数据转化

    // 调用dao层，将数据插入数据库
    
    let sqlResult = await fileUploadDao()

    return result;
}


export default uploadService;