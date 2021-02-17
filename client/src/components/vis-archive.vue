<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="mounted">
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
        stroke-width="3"
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
</template>

<script>
import * as d3 from 'd3'
export default {
  data () {
    return {
      currentCountry: 'Germany',
      mounted: false,
      opacity: .7,
      error: null,
      metric: 'relative',
      csv: null,
    }
  },

  props: {
    dimensions: Object,
    cases: Array,
  },

  computed: {
    scales: function() {
      if(!this.csv) return null
      let yDomain = [0,200]//d3.max(this.csv, d=>+d[this.metric])]
      let xDomain = d3.extent(this.csv, d=>d.date)
      return {
        x: d3.scaleTime().domain(xDomain).range([this.dimensions.left,this.dimensions.width-this.dimensions.left-this.dimensions.right]),
        y: d3.scaleLinear().domain(yDomain).range([this.dimensions.height-this.dimensions.bottom-this.dimensions.top,this.dimensions.top])
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
    const parseDate = d3.utcParse("%m/%d/%y")
    d3.csv('data.csv').then(d => {
      this.csv = d.map(row => {
        row.name = row.country
        row.date = parseDate(row.date)
        return row
      })
          .filter(d=> d.country == "Germany")
    })
  },

  mounted() {
    this.mounted = true;
    console.log(this.cases)
  },

  methods: {
    getRandomDate: function(extent) {
      let date = new Date(extent[0].getTime() + Math.random() * (extent[1].getTime() - extent[0].getTime()))
      date.setHours(0,0,0)
      return date
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

<style scoped>
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
