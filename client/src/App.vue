<template>
  <div class="wrapper">
    <div id="app" class="container-fluid" ref="container">
      <memoryForm />
      <svg :width="width" :height="height" v-if="mounted">
        <defs>
          <filter id="f0"><feGaussianBlur in="SourceGraphic" :stdDeviation="1" /></filter>
          <filter id="f1"><feGaussianBlur in="SourceGraphic" :stdDeviation="3" /></filter>
          <filter id="f1"><feGaussianBlur in="SourceGraphic" :stdDeviation="5" /></filter>
        </defs>

        <g class="lines" v-if="countries">
          <path
            v-for="country,i in countries"
            :key="i"
            :d="country.line"
            stroke-width="2"
            :class="(country.name == currentCountry) ? 'active' : 'hidden-'+(country.id%3)" />
        </g>

        <g class="reactions" v-if="reactions" transform="translate(0,0)">
          <circle
            v-for="reaction, j in reactions"
            :key="j" :cx="reaction.x"
            :cy="reaction.y"
            :opacity="opacity"
            :class="(reaction.country == currentCountry) ? 'active' : 'hidden-1'"
            :r="reaction.weight"
            fill="#FA5E2D"
            @mouseover="hover(reaction,$event)"
            @mouseout="hover(reaction,$event)" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import memoryForm from './components/memoryForm'
import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    memoryForm
  },

  data () {
    return {
      currentCountry: 'Germany',
      mounted: false,
      opacity: .7,
      width: 0,
      height: 0,
      margin: {top: 50, right: 50, bottom: 50, left: 50},
      metric: 'relative',
      csv: null,
    }
  },

  computed: {
    scales: function() {
      if(!this.csv) return null
      let yDomain = [0,200]//d3.max(this.csv, d=>+d[this.metric])]
      let xDomain = d3.extent(this.csv, d=>d.date)
      return {
        x: d3.scaleTime().domain(xDomain).range([this.margin.left,this.width-this.margin.left-this.margin.right]),
        y: d3.scaleLinear().domain(yDomain).range([this.height-this.margin.bottom-this.margin.top,this.margin.top])
      }
    },

    reactions: function(){
      if(!this.countries) return false

      let formatTime = d3.timeFormat("%m/%d/%y")
      let reactionArr = [] //create sample reactions
      Object.keys(this.countries).forEach(country => {
        d3.range(300).forEach(() => {
          let date = this.getRandomDate(this.scales.x.domain())
          reactionArr.push({
            date: date,
            value: this.countries[country].cases.find(c => formatTime(c.date) == formatTime(date))[this.metric],
            comment: "foobar",
            weight: Math.floor(Math.random()*3+2),
            country: country,
          })
        })
      })

      let force = d3.forceSimulation(reactionArr)
       .force('forceX', d3.forceX(reaction => this.scales.x(reaction.date)).strength(.1))
       .force('forceY', d3.forceY((reaction,i) => this.scales.y(reaction.value) + (-8 + (i%2)*16)).strength(.1))
       .force('collide', d3.forceCollide(d => d.weight))
     for (let i = 0; i < reactionArr.length; ++i) {
       force.tick()
     }
     return force.nodes()

    },

    countries: function() {
      if(!this.csv || !this.scales) return false

      const lineGenerator = d3.line()
        //.curve(d3.curveBasis)
        .x(d => this.scales.x(d.date))
        .y(d => this.scales.y(d[this.metric]))

     let countriesMap = d3.group(this.csv, d => d.country)
     let countriesObj = Object.fromEntries(countriesMap)
     Object.keys(countriesObj).map((key,i) => {
       countriesObj[key] = {
         id: i,
         cases: countriesObj[key],
         line: lineGenerator(countriesObj[key]),
         name: key
       }
     })
     return countriesObj
    },
  },

  created() {
    //this.$store.commit("callAPI",{foo: 'bar'})
    const parseDate = d3.utcParse("%m/%d/%y")
    d3.csv('data.csv').then(d => {
      this.csv = d.map(row => {
        row.name = row.country
        row.date = parseDate(row.date)
        return row
      })
          .filter(d=> d.country == "Germany")
    })

    window.addEventListener("resize", this.resize);
  },

  mounted() {

    this.$nextTick(() => {
      this.resize()
      this.mounted = true;
    })
  },

  methods: {
    getRandomDate: function(extent) {
      let date = new Date(extent[0].getTime() + Math.random() * (extent[1].getTime() - extent[0].getTime()))
      date.setHours(0,0,0)
      return date
    },

    resize: function() {
      this.width = this.$refs.container.offsetWidth
      this.height = window.innerHeight
    },

    hover: function(reaction,event) {
      let r = 10
      let opacity = 1
      if(event.type == 'mouseout') {
        r = reaction.weight
        opacity = this.opacity
      }
      d3.select(event.target).transition("50").attr("r",r).attr("opacity",opacity)
    }
  }
}
</script>

<style>
@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');

.wrapper {
  width: 100%;
  height: 100%;
  //background: radial-gradient(83.17% 83.17% at 18.37% 16.83%, #20CB86 0%, #15B5B5 100%);/* Rectangle 237 */
  //background: linear-gradient(121.09deg, #64033D 16.58%, #100530 82.74%);
}

#app {
  min-height: 100%;
  height: 100%
}

.hidden-0, .hidden-1, .hidden-2 {
  fill-opacity: .2;
  stroke-opacity: .5;
}
.hidden-0 {filter: url('#f0')}
.hidden-1 {filter: url('#f1')}
.hidden-2 {filter: url('#f2')}

path {
  fill: none;
  stroke: black;
}
</style>
