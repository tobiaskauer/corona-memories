<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="mounted" z-index="5">
    
    <filter id="blurMe">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
    
    <g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${dimensions.height-dimensions.top-dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${dimensions.width-dimensions.right})`"></g>

    <path
      :d="caseLine"
      stroke-width="3"
      fill="none"
      stroke="black"/>

    <g class="memories" v-if="beeswarm" transform="translate(0,0)">
      <g v-for="memory, j in beeswarm" :key="j">
        <circle
          :cx="memory.x"
          :cy="memory.y"
          :opacity="opacity"
          :r="memory.weight"
          fill="#FA5E2D"
          :filter="(overlay) ? 'url(#blurMe)' : ''"

          @click="$emit('showMemory',memory)"
          @mouseover="hover(memory,$event)"
          @mouseout="hover(memory,$event)" />

        <!--<text
          :x="memory.x"
          :y="memory.y"
          fill="#FA5E2D"
          @click="$emit('showMemory',memory)"
          @mouseover="hover(memory,$event)"
          @mouseout="hover(memory,$event)">{{memory.comment}}
          </text>-->
      </g> <!-- circleMemories </g>-->

      <g v-for="(memory, k) in lineMemories" :key="'line-'+k" >
        <path v-if="memory.path" :d="memory.path" stroke="#FA5E2D" fill="none" />
      </g>
    </g>

        

  

    <!--<g class="dateSelector" @click="$emit('showForm', formatDate(newMemory.date))" v-if="dateSelector">-->
    <g class="dateSelector" v-if="dateSelector">
      <circle r="25" cx="0" cy="0" fill="#FA5E2D"  :transform="`translate(${newMemory.circle.x},${newMemory.circle.y})`" />
      <!--<path d="M6 0H9V6H15V9H9V15H6V9H0V6H6V0Z" fill="white" transform="translate(-7,-15)" />-->
      <text v-if="newMemory.date" fill="white" font-size="10px"  :transform="`translate(${newMemory.circle.x},${newMemory.circle.y})`" text-anchor="middle">{{shortFormatDate(newMemory.startDate)}}</text>
      <path v-if="newMemory.line" :d="newMemory.line" stroke="#FA5E2D" fill="none" stroke-width="8" />
    </g>

    <g class="overlay" v-if="overlay">
      <rect x="0" y="0" :width="dimensions.width" :height="dimensions.height" fill="black" opacity=".5" pointer-events="none"/>
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

export default {
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      shortFormatDate: d3.timeFormat("%b %d"),
      lineGenerator: d3.line().curve(d3.curveBasis).x(d => d.x).y(d => d.y),
      mounted: false,
      mouseDown: false,
      opacity: 0.7, //circle opacity when not hovered
      forceDistance: 5, //distance of reactions to line
      linePosition: [0,0], //x and y of line overlay to add new memories
      currentMemory: null, //when currently displaying a memory, pick the right one to highlight
      newMemory: {
        startDate: null,
        endDate: null,
        show: false,
        circle: {x: 0, y: 0},
        line: false,
      },
    }
  },

  props: {
    dimensions: Object,
    cases: Array,
    memories: Array,
    dateSelector: Boolean,
    overlay: Boolean,

  },

  computed: {
    parsedCases: function() {
      return this.cases.map(c => {
        return {
          dateString: c.d,
          date: this.parseDate(c.d),
          value: c.v
        }
      })
    },

    scales: function() {
      if(!this.parsedCases) return null

      let yDomain = [0,d3.max([50,d3.max(this.parsedCases, d=>d.value)])] //minimum of 50 cases to have a somewhat consistent layout
      let xDomain = d3.extent(this.parsedCases, d=>d.date)
      let x = d3.scaleTime().domain(xDomain).range([this.dimensions.left,this.dimensions.width-this.dimensions.right])
      let y = d3.scaleLinear().domain(yDomain).range([this.dimensions.height-this.dimensions.bottom-this.dimensions.top,this.dimensions.top])
      
      return {x: x, y: y}
    },

    circleMemories: function() {
      if(!this.memories && !this.scales) return null
      let arr = this.memories
      if(arr && arr.length > 0) {
        arr = arr.filter(memory => memory.date == memory.enddate)
        arr.forEach(memory=> {
          memory.y = this.scales.y(this.getYforDate(memory.date))
          memory.x = this.scales.x(this.parseDate(memory.date))
        })
      }
      return arr
    },

    lineMemories: function() {
      if(!this.memories && !this.scales && this.caseLine) return null
      let arr = this.memories
      if(arr && arr.length > 0) {
        arr = arr.filter(memory => memory.date != memory.enddate)
        arr.forEach(memory=> {
          let segment = this.getLineSegment(memory.date,memory.enddate)
          if(segment.length > 0) segment.forEach(s => s.y = s.y - 5) 
          memory.path = this.lineGenerator(segment)
        })
      }
      return arr
    },


    beeswarm: function(){
      if(!this.circleMemories) return null

      let force = d3.forceSimulation(this.circleMemories)
       .force('forceX', d3.forceX(memory => memory.x).strength(.1))
       //.force('forceX', d3.forceX((memory,i) => memory.x + (-this.forceDistance + (i%2)*(this.forceDistance * 2)) ).strength(.1))
       //.force('forceY', d3.forceY((memory,i) => memory.y + (-this.forceDistance + (i%2)*(this.forceDistance * 2))).strength(.1))
       .force('forceY', d3.forceY(memory => memory.y+10).strength(.1))
       .force('collide', d3.forceCollide(d => d.weight))
     for (let i = 0; i < 10; ++i) {
       force.tick()
     }
     return force.nodes()
   },

    caseLine: function() {
      if(!this.scales) return false

      let arr = this.parsedCases.map(c => {
        c.x = this.scales.x(c.date)
        c.y = this.scales.y(c.value)
        return c;
      })

    return this.lineGenerator(arr)
  },
},

watch: {
  beeswarm: function(arr) { //show circle on overlay after beeswarm changed
    let c = arr.filter(e=>e.active)[0]
    if(c) {
      this.currentMemory = c
       this.currentMemory.connector = `
        M${c.x} ${c.y}
        Q${(this.dimensions.width/2)} ${c.y}
        ${(this.dimensions.width/2)} ${(this.dimensions.height/2)}`;
    }
  }
},


  async mounted() {
    this.mounted = true;
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
  },

  methods: {
    hover: function(memory,event) { //hovering circles
      if(!this.dateSelector) {  //disable hover when memory adding is in progress
        let r = 10
        let opacity = 1
        if(event.type == 'mouseout') {
          r = memory.weight
          opacity = this.opacity
       }
       d3.select(event.target).transition("50").attr("r",r).attr("opacity",opacity)
      }
    },

    getYforDate: function(dateString) {
      let valueOnMemoryDate = this.parsedCases.find(c => dateString == c.dateString)
      return valueOnMemoryDate ? valueOnMemoryDate.value : 0
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

    

    onMouseMove: function(event) { //follow line
      if(this.dateSelector) {
        let endDate = this.scales.x.invert(event.clientX)
        let dateString = this.formatDate(endDate)
        let value = this.scales.y(this.getYforDate(dateString))

        if(this.mouseDown) { //if mouse if pressed
          let arr = this.getLineSegment(this.newMemory.startDate,endDate)
          Vue.set(this.newMemory,'line', this.lineGenerator(arr)) //create svg Line
        }
        Vue.set(this.newMemory.circle,'x',event.clientX) //also move circle
        Vue.set(this.newMemory.circle,'y',value)
      }
    },

    onMouseDown: function(event) { //follow line
      if(this.dateSelector) {
        this.mouseDown = true
        let exactDate = this.scales.x.invert(event.clientX)
        Vue.set(this.newMemory,'startDate',exactDate)
      }
    },

    onMouseUp: function(event) { //follow line
      if(this.dateSelector) {
        this.mouseDown = false
        let exactDate = this.scales.x.invert(event.clientX)
        exactDate
        
      }
    },


  },

  directives: { //axis computation
    axis(el, binding) {
      let axis = d3.select(el)
      switch(binding.arg) {
        case "x":
          axis.call(d3
            .axisBottom(binding.value.x)
            .ticks(d3.timeMonth)
            .tickFormat(d3.timeFormat("%b"))
          );
          axis.selectAll(".domain").attr("stroke","none")
          axis.selectAll(".tick line").attr("stroke","none")
          axis.selectAll(".tick text")
            .style("text-anchor", "end")
            .style("text-transform", "UPPERCASE")
            .style("opacity", .3)
          break;
        case "y":
          axis.call(d3
            .axisRight(binding.value.y)
            .tickSize(-1000)
            .ticks(5)
          );
          axis.selectAll(".domain").attr("stroke","none")
          axis.selectAll(".tick line").attr("opacity",.05)
          axis.selectAll(".tick text").attr("opacity",.3)
          break;
      }

    }
  }
}
</script>

<style scoped>

</style>
