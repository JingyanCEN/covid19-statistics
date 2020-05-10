/**
 * 引入第三方包，每个包的具体作用太多不详细介绍，请自行在https://www.npmjs.com 上面搜
 */
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

/**
 * 初始化redis
 */
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

/**
 * 初始化数据库连接池
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '34.67.89.63',
  user     : 'root',
  password : 'root',
  database : 'covid19_google_user'
});

connection.connect();

/**
 * 数据接口，从redis获取全世界的数据，
 * 如果redis数据为空，则从数据库里面获取。
 */
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

/**
 * 数据接口，获取美国的数据。直接从数据库里面取，不走redis
 */
router.get("/america",async(ctx,next)=>{
  const redisRes = await getAsync("America")
  console.log(redisRes);
  const res = await datastore.get(datastore.key(["covid19ApiCache", "America"]))
  ctx.body = res[0].data
})

/**
 * 数据接口，获取中国的数据。直接从数据库里面取，不走redis
 */
router.get("/china",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "China"]))
  ctx.body = res[0].data
})

/**
 * 数据接口，获取澳大利亚的数据。直接从数据库里面取，不走redis
 */
router.get("/australia_confirmed",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaConfirmed"]))
  ctx.body = res[0].data
})

/**
 * 数据接口，获取澳大利亚的数据。直接从数据库里面取，不走redis
 */
router.get("/australia_deaths",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaDeaths"]))
  ctx.body = res[0].data
})

/**
 * 数据接口，获取澳大利亚的数据。直接从数据库里面取，不走redis
 */
router.get("/australia_tested",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaTested"]))
  ctx.body = res[0].data
})

/**
 * 数据接口，获取澳大利亚的数据。直接从数据库里面取，不走redis
 */
router.get("/australia_recovered",async(ctx,next)=>{
  const res = await datastore.get(datastore.key(["covid19ApiCache", "AustraliaRecovered"]))
  ctx.body = res[0].data
})


/**
 * 登录接口，接google sign
 */
router.post("/tokensignin",async(ctx,next)=>{
  const res = ctx.request.body
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")

  await new Promise((resolve,reject)=>{
    connection.query(`INSERT INTO user_base_info (username, avatar, first_login_time, last_login_time, token) VALUES ('${res.Qt.Ad}', '${res.Qt.gL}', '${now}','${now}','${res.tc.access_token}')`, function (error, results, fields) {
      if (error) throw error;
      resolve()
    });
  })
  ctx.body = "ok"
})


module.exports = router