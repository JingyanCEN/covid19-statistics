const Koa = require('koa')
const app = new Koa();
const koaStatic = require('koa-static');
//const job = require("./cronjob.js")
const routers= require('./router.js')
var bodyParser = require('koa-bodyparser')

app.use(bodyParser());
app.use(koaStatic('./dist'))
app.use(routers.routes()).use(routers.allowedMethods());
//job.start();

app.listen(80,()=>{
  console.info('\x1b[36m%s\x1b[0m', `Node Server is run at http://localhost:80`)
})