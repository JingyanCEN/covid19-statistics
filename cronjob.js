var CronJob = require('cron').CronJob;
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require("axios")
async function apiCache(){
  const World = await axios.get("https://api.covid19api.com/summary")
  // const World = await axios.get("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true")
  let America = await axios.get("https://api.apify.com/v2/datasets/FIbyK6uHUntt2kNy3/items?format=json&clean=1")
  const China = await  axios.get("https://lab.isaaclin.cn/nCoV/api/overall")
  // const China = await  axios.get("https://api.apify.com/v2/key-value-stores/x4iHxk7TVGI7UxFv6/records/LATEST?disableRedirect=true")
  const Australia_confirmed = await axios.get("https://api.infotorch.org/api/covid19/statlist/?format=json&geos=AU&stat=confirmed")
  const Australia_deaths = await axios.get("https://api.infotorch.org/api/covid19/statlist/?format=json&geos=AU&stat=deaths")
  const Australia_tested = await axios.get("https://api.infotorch.org/api/covid19/statlist/?format=json&geos=AU&stat=tested")
  const Australia_recovered = await axios.get("https://api.infotorch.org/api/covid19/statlist/?format=json&geos=AU&stat=recovered")

  const redis = require("redis");
  const client = redis.createClient({
    host: '10.99.183.11',
    port: 6379
  });
  const { promisify } = require("util");
  const setAsync = promisify(client.set).bind(client);
  
  client.on("error", function(error) {
    console.error(error);
  });

  America.data = America.data.filter(v=>v.casesByDays)
  if(America.data.length > 10){
    America.data = America.data.slice(America.data.length - 10)
  }
  await setAsync("World", JSON.stringify({
      data: World.data,
      Date: new Date().getTime()
    }))
  await datastore.save({
    key: datastore.key(["covid19ApiCache", "World"]),
    data: {
      data: World.data,
      Date: new Date().getTime()
    }
  })
  
  await datastore.save({
    key: datastore.key(["covid19ApiCache", "America"]),
    data: {
      data: America.data,
      Date: new Date().getTime()
    }
  })


  await datastore.save({
    key: datastore.key(["covid19ApiCache", "China"]),
    data: {
      data: China.data,
      Date: new Date().getTime()
    }
  })


  await datastore.save({
    key: datastore.key(["covid19ApiCache", "AustraliaConfirmed"]),
    data: {
      data: Australia_confirmed.data,
      Date: new Date().getTime()
    }
  })


  await datastore.save({
    key: datastore.key(["covid19ApiCache", "AustraliaDeaths"]),
    data: {
      data: Australia_deaths.data,
      Date: new Date().getTime()
    }
  })

  await datastore.save({
    key: datastore.key(["covid19ApiCache", "AustraliaTested"]),
    data: {
      data: Australia_tested.data,
      Date: new Date().getTime()
    }
  })

  
  await datastore.save({
    key: datastore.key(["covid19ApiCache", "AustraliaRecovered"]),
    data: {
      data: Australia_recovered.data,
      Date: new Date().getTime()
    }
  })


}
// var job = new CronJob(
//   // every 10 min 
//   '0 0/10 * * * *',
//   apiCache
// );

apiCache()
module.exports = apiCache
