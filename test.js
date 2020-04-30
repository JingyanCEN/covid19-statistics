const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require("axios")

async function test() {
  const World = await axios.get("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true")
  const America = await axios.get("https://api.apify.com/v2/datasets/FIbyK6uHUntt2kNy3/items?format=json&clean=1")
  const China = await  axios.get("https://api.apify.com/v2/key-value-stores/x4iHxk7TVGI7UxFv6/records/LATEST?disableRedirect=true")
  await datastore.save({
    key: datastore.key(["covid19", "apiCache"]),
    data: {
      World: World.data,
      America: America.data,
      China: China.data,
      Date: new Date().getTime()
    }
  })
}
test() 