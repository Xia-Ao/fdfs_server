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



## 使用
等加入用户权限之后


## 后续问题


### 用户鉴权
图床2.0 计划加入用户权限

### SQL批量操作
 应该使用事务的方式对批量进行操作，这样一旦某一个出错，对已操作的进行回滚操作。

 目前采用的的方案：
 - 批量上传操作：使用事务执行多条sql，如果遇到错误，回滚，同时将fdfs也执行回滚。
 - 批量删除操作：一条SQL语句操作执行批量命令，某一个遇到错误不做处理，待改进


## 开发过程中遇到问题

### 服务容错
以前接口服务开发经验较少，做起来之后发现为了实现服务的容错能力，需要做很多的条件判断和容错处理，可能正常流程的代码函数就50行，加上各种容错之后变成了100行，后续多思考代码的健壮性。
- 应该从哪几方面考虑
  - 入参 以及 入参判断
  - 使用上一步的结果时，结果的多种情况判断。
  - 多个异步操作，某一个操作出错，其他的异步操作应该怎么处理，全部回滚还是部分回滚。


### SQL的合并执行
在批量操作或者需要多条sql执行的情况下，不要每次执行一条连接一次数据库，执行完断开。通过事务或者合并sql提升sql执行效率。这这一块需要加强学习。

### DAO设计
如何设计一个灵活，易组合，业务解耦，高效的SQL命令。多参考spring等框架的DAO层的设计。