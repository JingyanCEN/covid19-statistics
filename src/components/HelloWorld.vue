<template>
  <div class="container">
    <div>
      <b-tag type="is-info" size="is-large">World</b-tag>
    </div>
    <canvas ref="barChart" width="800" height="400"></canvas>
    <div>
      <b-tag type="is-info" size="is-large">United States</b-tag>
    </div>
    <canvas ref="lineChart" width="800" height="400"></canvas>
    <div>
      <b-tag type="is-info" size="is-large">China</b-tag>
    </div>
    <canvas ref="barChart2" width="800" height="400"></canvas>
    <!-- <b-table :data="data" :columns="columns"></b-table> -->
  </div>
</template>

<script>
import Chart from "chart.js"
import axios from "axios"
import dayjs from "dayjs"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  async mounted() {
    const res = await axios.get("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true")
    new Chart(this.$refs.barChart, {
        type: 'bar',
        data: {
            labels: res.data.map(v=>v.country),
            datasets: [{
                label: 'infected people count',
                data: res.data.map(v=>v.infected),
                backgroundColor: res.data.map((v,i)=>v.infected>300000?'#D92121': v.infected>100000? "#F0925B":"#F7B76E"),
            }]
        },
    });    
    const res2 = await axios.get("https://api.apify.com/v2/datasets/FIbyK6uHUntt2kNy3/items?format=json&clean=1")
    new Chart(this.$refs.lineChart, {
      type: 'line',
      data: {
        labels: res2.data[res2.data.length-1].casesByDays.map(v=>dayjs(v.date).format("MM-DD")).slice(20) ,
        datasets: [{
            label: 'case in United States',
            data: res2.data[res2.data.length-1].casesByDays.map(v=>v.value).slice(20),
            backgroundColor: "#FF7B69"
        }]
      }
    });
    const res3 = await axios.get("https://api.apify.com/v2/key-value-stores/x4iHxk7TVGI7UxFv6/records/LATEST?disableRedirect=true")
    new Chart(this.$refs.barChart2, {
      type: 'horizontalBar',
      data: {
        labels: ["infected","recovered","tested","deceased","currentConfirmedCount","suspectedCount","seriousCount"] ,
        datasets: [{
            label: "count",
            data: [res3.data.infected,res3.data.recovered,res3.data.tested,res3.data.deceased,res3.data.currentConfirmedCount,res3.data.suspectedCount,res3.data.seriousCount,],
            backgroundColor: "#10AEB5"
        }]
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  min-height: 100vh;
  width: 60vw;;
  margin: auto;
  background-color: white;
  margin-top:100px;
  border-radius: .625rem;
  text-align: left;
}
</style>
