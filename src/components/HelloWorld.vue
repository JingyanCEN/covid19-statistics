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
    <canvas ref="australia1" width="800" height="400"></canvas>
    <canvas ref="australia2" width="800" height="400"></canvas>
    <canvas ref="australia3" width="800" height="400"></canvas>
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
            labels: res.data.Countries.sort((a,b)=>b.TotalConfirmed-a.TotalConfirmed).slice(0,20).map(v=>v.Country),
            datasets: [{
                label: 'infected people count',
                data: res.data.Countries.sort((a,b)=>b.TotalConfirmed-a.TotalConfirmed).slice(0,20).map(v=>v.TotalConfirmed),
                backgroundColor: res.data.Countries.sort((a,b)=>b.TotalConfirmed-a.TotalConfirmed).slice(0,20).map((v,i)=>v.TotalConfirmed>300000?'#D92121': v.TotalConfirmed>100000? "#F0925B":"#F7B76E"),
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
        labels: ["currentConfirmedCount","confirmedCount","suspectedCount","curedCount","deadCount","seriousCount"] ,
        datasets: [{
            label: "count",
            data: [res3.data.results[0].currentConfirmedCount,
            res3.data.results[0].confirmedCount,
            res3.data.results[0].suspectedCount,
            res3.data.results[0].curedCount,
            res3.data.results[0].deadCount,
            res3.data.results[0].seriousCount,],
            backgroundColor: "#10AEB5"
        }]
      }
    });
    const res4_confirmed = await axios.get("australia_confirmed")
    const res4_deaths = await axios.get("australia_deaths")
    const res4_tested = await axios.get("australia_tested")
    const res4_recovered = await axios.get("australia_recovered")
    new Chart(this.$refs.australia1, {
      type: 'line',
      data: {
        labels: res4_tested.data[0].data.map(v=>v.x),
        datasets: [{
            label: "tested",
            data: res4_tested.data[0].data.map(v=>v.y),
            backgroundColor: "#36A2EB"
        }]
      }
    });
    new Chart(this.$refs.australia2, {
      type: 'line',
      data: {
        labels: res4_confirmed.data[0].data.map(v=>v.x),
        datasets: [{
            label: "confirmed",
            data: res4_confirmed.data[0].data.map(v=>v.y),
            backgroundColor: "#FF6A57"
        }]
      }
    });
    new Chart(this.$refs.australia3, {
      type: 'line',
      data: {
        labels: res4_confirmed.data[0].data.map(v=>v.x),
        datasets: [{
            label: "deaths",
            data: res4_deaths.data[0].data.map(v=>v.y),
            borderColor: "#FF6384"
        },{
            label: "recovered",
            data: res4_recovered.data[0].data.map(v=>v.y),
            borderColor: "#10AEB5"
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
