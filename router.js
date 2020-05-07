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

const redis = require("redis");
const client = redis.createClient({
  host: '10.99.183.11',
  port: 6379
});
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

client.on("error", function(error) {
  console.error(error);
});


router.get("/world",async(ctx,next)=>{
  const redisRes = await getAsync("World")
  console.log(JSON.parse(redisRes));
  if(!redisRes ){
    const res = await datastore.get(datastore.key(["covid19ApiCache", "World"]))
    ctx.body = res[0].data
  }else{
    ctx.body = JSON.parse(redisRes).data
  }


})
router.get("/america",async(ctx,next)=>{
  const redisRes = await getAsync("America")
  console.log(redisRes);
  const res = await datastore.get(datastore.key(["covid19ApiCache", "America"]))
  ctx.body = res[0].data

})
router.get("/china",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "China"]))
  ctx.body = res[0].data
})
router.get("/australia_confirmed",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaConfirmed"]))
  ctx.body = res[0].data
})
router.get("/australia_deaths",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaDeaths"]))
  ctx.body = res[0].data
})
router.get("/australia_tested",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaTested"]))
  ctx.body = res[0].data
})
router.get("/australia_recovered",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaRecovered"]))
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
  const res = ctx.request.body
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")

  await new Promise((resolve,reject)=>{
    connection.query(`INSERT INTO user_base_info (username, avatar, first_login_time, last_login_time, token) VALUES ('${res.Qt.Ad}', '${res.Qt.gL}', '${now}','${now}','${res.tc.access_token}')`, function (error, results, fields) {
      if (error) throw error;
      resolve()
    });
  })
  
  //connection.end();
  ctx.body = "ok"
})

// const apiCache = require("./cronjob.js")
// router.post("/apicache",async(ctx,next)=>{
//   console.log(ctx.request.body);
  
//   if(ctx.request.body === "apicache") {
//     await apiCache()
//     ctx.body = 'ok'
//   }else{
//     ctx.body = "not ok"
//   }
// })

module.exports = router