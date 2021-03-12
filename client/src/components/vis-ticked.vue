<template>
  <svg :width="options.dimensions.width" :height="options.dimensions.height">
    <!-- axis and case line (packed into component because easy to compute) -->
    <lines
      :dimensions="options.dimensions"
      :scales="scales"
      :cases="parsedCases" />

    <!-- beeswarm (and labels) -->
    <g class="memories"  transform="translate(0,0)">
      <g id="beeswarm" />
    </g>

    <!-- datepicker (shown as AVG line when adding a memory) -->
    <g class="datePicker" @click="$emit('toggleForm', formatDate(newMemory.date))"
     v-if="datePicker"
     :transform="`translate(${newMemory.position.x},0)`"> <!-- can go to own component -->
      <line y1="0" :y2="options.dimensions.height" x1="0" x2="0" stroke="#FA5E2D" stroke-width="2px"  stroke-dasharray="0"/>
      <circle r="40" cx="0" :cy="newMemory.position.y" fill="#FA5E2D" />
      <text x="0" text-anchor="middle" :y="(newMemory.position.y)">{{getRoughDate(newMemory.date)}}</text>
    </g>

    <!-- SVG overlay (shown when adding or viewing memories) -->
    <g class="overlay" v-if="options.overlay">
      <rect x="0" y="0" :width="options.dimensions.width" :height="options.dimensions.height" fill="black" opacity=".5" pointer-events="none"/>
      <g v-if="currentMemory">
        <circle
          r=20
          :cx="currentMemory.x"
          :cy="currentMemory.y"
          fill="#FA5E2D" />
        <path
          :d="currentMemory.connector"
          stroke-width="2"
          fill="none"
          stroke="#FA5E2D"/>
      </g>
    </g>
  </svg>
</template>

<script>
import Vue from 'vue'
import * as d3 from 'd3'
import lines from './lines'


export default {
  components: {
    lines,
  },

  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),

      //graph: null, this is memories
      //simulation: null, //this is beeswarm

      mounted: false,
      beeswarm: null,
      opacity: 0.7, //circle opacity when not hovered
      forceDistance: 10, //distance of reactions to line

      currentMemory: null, //when currently displaying a memory, pick the right one to highlight
      newMemory: {
        date: null,
        show: false,
        position: {x: -100, y: -100}, //start out of sight
      },
    }
  },

  props: {
    options: Object,
    hashtag: String,
    cases: Array,
    memories: Array,
    datePicker: Boolean,
  },

  computed: {
     //take cases from property, parse and assign readable keys
    parsedCases: function() {
      return this.cases.map((c) => {
        return {
          dateString: c.d,
          date: this.parseDate(c.d),
          value: c.v,
          //slope: (i>5) ? c.v - this.cases[i-6].v : 0 //helps computing the beeswarm's distance
        }
      })
    },

    //use parsedCases to compute scales (to place line and memories on)
    scales: function() {
      if(!this.parsedCases) return null

      let yDomain = [0,d3.max([50,d3.max(this.parsedCases, d=>d.value)])] //minimum of 50 cases to have a somewhat consistent layout
      let xDomain = d3.extent(this.parsedCases, d=>d.date)
      let radiusDomain = d3.extent(this.memories, d=>d.weight)

      let x = d3.scaleTime().domain(xDomain).range([this.options.dimensions.left,this.options.dimensions.width-this.options.dimensions.right])
      let y = d3.scaleLinear().domain(yDomain).range([this.options.dimensions.height-this.options.dimensions.bottom-this.options.dimensions.top,this.options.dimensions.top])
      let radius = d3.scaleLinear().domain(radiusDomain).range([3,4])
      
      return {x: x, y: y, radius: radius}
    },


    circles: function() {
      let that = this
      if(!that.beeswarm) return null
      return d3.select("#beeswarm")
        .selectAll("circle")
        .data(this.beeswarm.nodes())
        .enter()
        .append("circle")
        .attr("r",5)
        .attr("fill","#FA5E2D")
    }
  },

  watch: {
    memories: function(memories) {
      this.releaseTheBees(memories)
    },

    hashtag: function(newHashtag){
      if(!this.beeswarm) return null
      this.beeswarm.forEach((memory,i) => {
        if(newHashtag && !memory.comment.includes(newHashtag)) {
          Vue.set(this.beeswarm[i],'inactive',true)
        } else {
          Vue.set(this.beeswarm[i],'inactive',false)
       }
      })
   },
  },

  async mounted() {
    this.releaseTheBees(this.memories)
    document.addEventListener('mousemove', this.onMouseMove)
    this.mounted = true;
  },

  methods: {
    releaseTheBees: function(memories) {
       this.beeswarm = d3.forceSimulation(memories)
      .force('forceX', d3.forceX(memory => this.scales.x(this.parseDate(memory.date))).strength(.1))
      .force('forceY', d3.forceY(memory => this.scales.y(this.getLineElement(memory.date).value)).strength(.1))
      .force('collide', d3.forceCollide(d => this.scales.radius(d.weight) + .5))
      //.stop()

    },

    hover: function(memory,event) { //hovering circles
      if(!this.datePicker) {  //disable hover when memory adding is in progress
        let r = 10
        let opacity = 1
        if(event.type == 'mouseout') {
          r = memory.weight
          opacity = this.opacity
       }
       d3.select(event.target).transition("50").attr("r",r).attr("opacity",opacity)
      }
    },

    getLineElement: function(dateString) {
      let valueOnMemoryDate = this.parsedCases.find(c => dateString == c.dateString)
      return valueOnMemoryDate ? valueOnMemoryDate : null
    },

    getLineSegment: function(startDate,endDate) {
      startDate = (typeof startDate === 'string') ? this.parseDate(startDate) : startDate
      endDate = (typeof endDate === 'string') ? this.parseDate(endDate) : endDate
      let segment = this.parsedCases.filter(c => //get parts of the caseLine that match current dates
            (c.date < endDate && c.date > startDate) //forward movement
            || (c.date > endDate && c.date < startDate) //backward movement
          )
      return segment
    },

    getRoughDate: function(date) {
      if(!date) return null
      
      let rough = "Late"
      if(date.getDate() < 20) rough = "Mid"
      if(date.getDate() < 10) rough = "Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()]
        
      return rough+" "+month
    },

    onMouseMove: function(event) { //follow line
      if(this.datePicker) {
        if(event.clientX > this.scales.x.range()[0] && event.clientX < this.scales.x.range()[1]) { //check whether we are moving within vis boundaries to avoid errors
          let date = this.scales.x.invert(event.clientX)
          let dateString = this.formatDate(date)
          let value = this.scales.y(this.getLineElement(dateString).value)
          Vue.set(this.newMemory,'date',date) //also move circle
          Vue.set(this.newMemory.position,'x',event.clientX) //also move circle
          Vue.set(this.newMemory.position,'y',value)
        }
      }
    },
  },

  updated: function() {
    var that = this;
      that.beeswarm.nodes(that.memories).on('tick', function ticked() {
          
        that.circles
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; });
    });
  },
}
</script>

<style scoped>
.datePicker {
  cursor: pointer;
}

.datePicker text {
  font-size: 12px;
  pointer-events: none;
}

circle.inactive {
  opacity: .2 !important;
  fill: grey !important;
  pointer-events: none;
}

.datePicker text.strong {
  font-weight: bold;
}
</style>
