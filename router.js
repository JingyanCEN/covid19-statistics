var Router = require('koa-router');
var router = new Router();
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const dayjs = require('dayjs')

router.get("/world",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "World"]))
  ctx.body = res[0].data
})
router.get("/america",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "America"]))
  ctx.body = res[0].data

})
router.get("/china",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "China"]))
  ctx.body = res[0].data
})

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '34.67.89.63',
  user     : 'root',
  password : 'root',
  database : 'covid19_google_user'
});

router.post("/tokensignin",async(ctx,next)=>{
  console.log(ctx.request.body);
  const res = ctx.request.body
  connection.connect();
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")

  await new Promise((resolve,reject)=>{
    connection.query(`INSERT INTO user_base_info (username, avatar, first_login_time, last_login_time, token) VALUES ('${res.Qt.Ad}', '${res.Qt.gL}', '${now}','${now}','${res.tc.access_token}')`, function (error, results, fields) {
      if (error) throw error;
      resolve()
    });
  })
  
  connection.end();
  //存数据库
  ctx.body = "ok"
})

module.exports = router