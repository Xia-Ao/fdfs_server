/*
* @Description:   文件上传服务
* @Author: ao.xia
* @Date: 2019-12-12 20:14:01
 * @Last Modified by: ao.xia
 * @Last Modified time: 2019-12-12 20:17:55
*/

const uploadService = async (file) => {

    let result = await uploadDao();

    return result;
}


export default uploadService;