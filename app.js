/**
 * 引入第三方包，每个包的具体作用太多不详细介绍，请自行在https://www.npmjs.com 上面搜
 */
const Koa = require('koa')
const app = new Koa();
const koaStatic = require('koa-static');
const job = require("./cronjob.js")
const routers= require('./router.js')
var bodyParser = require('koa-bodyparser')

// 注册koa-bodyparser
app.use(bodyParser());

// 注册koa-static
app.use(koaStatic('./dist'))

// 注册koa
app.use(routers.routes()).use(routers.allowedMethods());

// 开启cron定时任务，定时拉取第三方api并缓存，详情见cronjob.js文件
job.start();

// 服务器在80端口启动
app.listen(80,()=>{
  console.info('\x1b[36m%s\x1b[0m', `Node Server is run at http://localhost:80`)
})