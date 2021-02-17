<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="mounted">

      <path
        :d="line"
        stroke-width="3"
        fill="none"
        stroke="black"/>

    <g class="memories" v-if="beeswarm" transform="translate(0,0)">
      <circle
        v-for="memory, j in beeswarm"
        :key="j"
        :cx="memory.x"
        :cy="memory.y"
        :opacity="opacity"
        :r="memory.weight"
        fill="#FA5E2D"
        @mouseover="hover(memory,$event)"
        @mouseout="hover(memory,$event)" />
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      mounted: false,
      opacity: 0.7,
      forceDistance: 6
    }
  },

  props: {
    dimensions: Object,
    cases: Array,
    metric: String,
    memories: Array
  },

  computed: {
    parsedCases: function() {
      return this.cases.map(c => {
        return {
          date: this.parseDate(c.d),
          relative: c.r,
          cumulative: c.c,
          new: c.n
        }
      })
    },

    scales: function() {
      if(!this.parsedCases) return null

      let yDomain = d3.extent(this.parsedCases, d=>d[this.metric])
      let xDomain = d3.extent(this.parsedCases, d=>d.date)
      return {
        x: d3.scaleTime().domain(xDomain).range([this.dimensions.left,this.dimensions.width-this.dimensions.left-this.dimensions.right]),
        y: d3.scaleLinear().domain(yDomain).range([this.dimensions.height-this.dimensions.bottom-this.dimensions.top,this.dimensions.top])
      }
    },

    beeswarm: function(){
      if(!this.memories || !this.parsedCases) return null

      //get y values for each bubble
      this.memories.forEach(memory => {
        memory.value = this.parsedCases.find(c => memory.date == this.formatDate(c.date))[this.metric]
      })

      let force = d3.forceSimulation(this.memories)
       .force('forceX', d3.forceX((memory,i) => this.scales.x(this.parseDate(memory.date))+ (-this.forceDistance + (i%2)*(this.forceDistance * 2)) ).strength(.1))
       .force('forceY', d3.forceY((memory,i) => this.scales.y(memory.value) + (-this.forceDistance + (i%2)*(this.forceDistance * 2))).strength(.1))
       .force('collide', d3.forceCollide(d => d.weight))
     for (let i = 0; i < this.memories.length; ++i) {
       force.tick()
     }
     return force.nodes()

   },

    line: function() {
      if(!this.cases || !this.scales) return false

      const lineGenerator = d3.line()
        .curve(d3.curveBasis)
        .x(d => this.scales.x(d.date))
        .y(d => this.scales.y(d[this.metric]))

    return lineGenerator(this.parsedCases)

  },
},


  async mounted() {
    this.mounted = true;



    /*this.countries = (await getCasesService.getCountries()).data.map(e => e.country)
    let formatTime = d3.timeFormat("%Y-%m-%d")
    let reactionArr = [] //create sample reactions
    d3.range(50000).forEach(() => {
      let date = this.getRandomDate(this.scales.x.domain())
      reactionArr.push({
        date: formatTime(date),
        value: this.parsedCases.find(c => formatTime(c.date) == formatTime(date))[this.metric],
        comment: "foobar",
        weight: Math.floor(Math.random()*3+2),
        country: this.countries[Math.floor(Math.random()*this.countries.length)],
      })
    })

    console.log(JSON.stringify(reactionArr))*/
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

<style scoped></style>
