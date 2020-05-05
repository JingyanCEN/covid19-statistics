var Router = require('koa-router');
var router = new Router();
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const dayjs = require('dayjs')
const {Logging} = require('@google-cloud/logging');
const projectId = "heroic-equinox-275516"
const logName ="covid10-website"
const logging = new Logging({projectId});
const log = logging.log(logName);

router.get("/world",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "World"]))
  ctx.body = res[0].data
})
router.get("/america",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "America"]))
  ctx.body = res[0].data

})
router.get("/china",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "China"]))
  ctx.body = res[0].data
})
router.get("/australia_confirmed",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "Australia_confirmed"]))
  ctx.body = res[0].data
})
router.get("/australia_deaths",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "Australia_deaths"]))
  ctx.body = res[0].data
})
router.get("/australia_tested",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "Australia_tested"]))
  ctx.body = res[0].data
})
router.get("/australia_recovered",async(ctx,next)=>{
  await log.write(log.entry({resource: {type: 'global'}},ctx.path))
  const res = await datastore.get(datastore.key(["covid19ApiCache", "Australia_recovered"]))
  ctx.body = res[0].data
})

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '34.67.89.63',
  user     : 'root',
  password : 'root',
  database : 'covid19_google_user'
});

connection.connect();
router.post("/tokensignin",async(ctx,next)=>{
  //console.log(ctx.request.body);
  const res = ctx.request.body
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")

  await new Promise((resolve,reject)=>{
    connection.query(`INSERT INTO user_base_info (username, avatar, first_login_time, last_login_time, token) VALUES ('${res.Qt.Ad}', '${res.Qt.gL}', '${now}','${now}','${res.tc.access_token}')`, function (error, results, fields) {
      if (error) throw error;
      resolve()
    });
  })
  
  //connection.end();
  //存数据库
  ctx.body = "ok"
})

module.exports = router