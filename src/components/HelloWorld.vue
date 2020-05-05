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
    <div>
      <b-tag type="is-info" size="is-large">Australia</b-tag>
    </div>
    <canvas ref="australia" width="800" height="400"></canvas>
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
    const res = await axios.get("/world")
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
    const res2 = await axios.get("america")
    const data2 = res2.data.filter(v=>v.casesByDays)
    new Chart(this.$refs.lineChart, {
      type: 'line',
      data: {
        labels: data2[data2.length-1].casesByDays.filter(v=>dayjs(v.date) < dayjs()).map(v=>dayjs(v.date).format("MM-DD")) ,
        datasets: [{
            label: 'case in United States',
            data: data2[data2.length-1].casesByDays.filter(v=>dayjs(v.date) < dayjs()).map(v=>v.value),
            backgroundColor: "#FF7B69"
        }]
      }
    });
    const res3 = await axios.get("china")
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
    const res4_confirmed = await axios.get("australia_confirmed")
    const res4_deaths = await axios.get("australia_deaths")
    const res4_tested = await axios.get("australia_tested")
    const res4_recovered = await axios.get("australia_recovered")
    new Chart(this.$refs.australia, {
      type: 'line',
      data: {
        labels: res4_confirmed.data.data.map(v=>v.x),
        datasets: [{
            label: "count",
            data: res4_confirmed.data.data.map(v=>v.y),
            backgroundColor: "#FF6A57"
        },{
            label: "count",
            data: res4_deaths.data.data.map(v=>v.y),
            backgroundColor: "#FF6384"
        },{
            label: "count",
            data: res4_tested.data.data.map(v=>v.y),
            backgroundColor: "#36A2EB"
        },{
            label: "count",
            data: res4_recovered.data.data.map(v=>v.y),
            backgroundColor: "#10AEB5"
        }
        ]
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
