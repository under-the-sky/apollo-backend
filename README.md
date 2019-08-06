#### 关于
该APP为纯后端项目

#### 技术栈
nodejs + typescript + express + mongodb + mongoose + es6/7 + swagger + passport 

#### 运行

```
npm install 
npm run dev

项目访问: http://localhost:3000
swagger: http://localhost:3000/api-docs/

```


# 项目布局

```
.
├── lib                        
│   ├── config                  相关配置
│   ├── controller              模型控制，负责处理数据相关
│   ├── models                  定义模型
│   ├── routers                 路由
│   ├── app.ts                  基础配置
│   ├── server.ts               入口文件
├── .env
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json 

```

#### 相关资源
swagger用法可以参考 https://github.com/pgroot/express-swagger-generator 

mongoose https://mongoosejs.com/docs/guide.html

第三方认证参考 http://www.passportjs.org/

expressJs官网 https://expressjs.com/

nodeJs api文档 http://nodejs.cn/api/
