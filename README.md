# 自建图床存储服务 server端

## 说明
自建图床存储服务，在网上找过很多图床服务，都不是很好用，没有办法自定义扩展。

使用阿里云服务，存储在ECS硬盘上，因为自己一个人使用，存储量不会很大，能够满足需求。

## 架构

koa + koa-router + fdfs

服务按照传统的分层，分为 `router`, `controller`, `service`, `dao`, `model` 。

## 目录
```
.
├── common                                  // 公用
│   ├── fdfs.js
│   ├── mime.js
│   └── utils.js
├── controller                              // controller
│   └── fileUploadController.js
├── dao                                     // dao层
│   ├── DB                                  // 数据库操作util
│   │   └── db-util.js
│   ├── SQL                                 // SQL 语句
│   │   └── fdfsSQL.js
│   └── fdfsDoMapper.js                     // dao层Mapper类。对外使用
├── model                                   // 数据模型层
│   ├── definedData.js
│   ├── fdfs                                // fdfs 表数据模型
│   │   ├── fdfsDoToModel.js
│   │   └── fdfsModelToDo.js
│   ├── resultData                          // 返回结果数据模型
│   │   ├── daoResultModel.js
│   │   ├── messageModel.js
│   │   ├── responseModel.js
│   │   └── serviceResultModel.js
│   └── 失败的数据模型                          // 设计失败了的数据模型
│       ├── fdfsDoToModel.js
│       └── fdfsModelToDo.js
├── router                                  // 全局路由
│   └── imgFile.js                          // 图片文件路由
└── services                                // service层
    ├── deleteFileService.js                // 删除文件service
    ├── getFileService.js                   // 查询文件service
    └── uploadFileService.js                // 上传文件service
```

## 后续问题



### 用户鉴权
图床2.0 计划加入用户权限

### SQL批量操作
 应该使用事务的方式对批量进行操作，这样一旦某一个出错，对已操作的进行回滚操作。

 目前采用的的方案：
 - 批量上传操作：使用事务执行多条sql，如果遇到错误，回滚，同时将fdfs也执行回滚。
 - 批量删除操作：一条SQL语句操作执行批量命令，某一个遇到错误不做处理，待改进
