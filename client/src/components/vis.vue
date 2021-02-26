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
        </g>
    </g>

    <g class="dateSelector" @click="$emit('showForm', formatDate(newMemory.date))" v-if="dateSelector" :transform="`translate(${newMemory.x},${newMemory.y})`">
      <circle r="25" cx="0" cy="0" fill="#FA5E2D"  />
      <!--<path d="M6 0H9V6H15V9H9V15H6V9H0V6H6V0Z" fill="white" transform="translate(-7,-15)" />-->
      <text v-if="newMemory.date" fill="white" font-size="10px" x="0" y="4" text-anchor="middle">{{shortFormatDate(newMemory.date)}}</text>
    </g>

    <g class="overlay" v-if="overlay">
      <rect x="0" y="0" :width="dimensions.width" :height="dimensions.height" fill="black" opacity=".5" pointer-events="none"/>
      <g v-if="currentMemory">

        <circle
          r=20
          :cx="currentMemory.x"
          :cy="currentMemory.y"
          fill="#FA5E2D" />

        <!--<line
          :x1="currentMemory.x"
          :y1="currentMemory.y"
          :x2="(dimensions.width/2)"
          :y2="(dimensions.height/2)"
          stroke-width="2"
          stroke="#FA5E2D"/>-->
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
      mounted: false,
      opacity: 0.7, //circle opacity when not hovered
      forceDistance: 5, //distance of reactions to line
      linePosition: [0,0], //x and y of line overlay to add new memories
      currentMemory: null, //when currently displaying a memory, pick the right one to highlight
      newMemory: {
        date: null,
        show: false,
        x: 0,
        y: 0,
      },
      //time: 1,
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

    computedMemories: function() {
      if(!this.memories && !this.scales) return null
      let arr = this.memories
      if(arr && arr.length > 0) {
        arr.forEach(memory=> {
          memory.y = this.scales.y(this.getYforDate(memory.date))
          memory.x = this.scales.x(this.parseDate(memory.date))
        })
      }
      //if(this.dateSelector) { arr[this.memories.length] = this.newMemory

      return arr
    },

    /*xyMapping: function() { //mapping Dates (string) to y-positions to more easily compute linePosition and beeswarm start positions
      if(!this.scales) return null
      let obj = {}
      this.parsedCases.forEach(c => {
        obj[c.dateString] = {
          x: this.scales.x(c.date)
          y: this.scales.y(c[this.metric])
        }
      })

      return obj
    },*/

    beeswarm: function(){
      if(!this.computedMemories) return null

      let force = d3.forceSimulation(this.computedMemories)
       .force('forceX', d3.forceX((memory,i) => memory.x + (-this.forceDistance + (i%2)*(this.forceDistance * 2)) ).strength(.1))
       .force('forceY', d3.forceY((memory,i) => memory.y + (-this.forceDistance + (i%2)*(this.forceDistance * 2))).strength(.1))
       .force('collide', d3.forceCollide(d => d.weight))
     for (let i = 0; i < 10; ++i) {
       force.tick()
     }

     return force.nodes()
   },

  /* gridLines: function() {
     if(!this.scales) return false
     let arr = []
     for (let i = this.scales.y.domain()[0]; i<= this.scales.y.domain()[1]; i++) { //go from the bottom of your y-axis to the top
       if(i%50 == 0 && i != 0) { //find every valuable thats divisible by 50
         arr.push({ //change it's position in the gridLine array (for dynamic change)
           value: i,
           y: this.scales.y(i)
         })
       }
     }
     return arr
   },*/


    caseLine: function() {
      if(!this.scales) return false

      const lineGenerator = d3.line()
        .curve(d3.curveBasis)
        .x(d => this.scales.x(d.date))
        .y(d => this.scales.y(d.value))

    return lineGenerator(this.parsedCases)
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

    /*let obj = {}
    d3.csv('worldbank-population.csv')
    .then((csv) => {
      csv.forEach(data => {
        obj[data.Country] = {Code: data.Code, Population: data.Population}
      })
      console.log(obj)
    })*/
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

    

    onMouseMove: function(event) { //follow line
      if(this.dateSelector) {
        let exactDate = this.scales.x.invert(event.clientX)
        let dateString = this.formatDate(exactDate)

        //let value = this.parsedCases.find(c => c.dateString == dateString).value
        
        Vue.set(this.newMemory,'date',exactDate)
        Vue.set(this.newMemory,'x',event.clientX)
        Vue.set(this.newMemory,'y',this.scales.y(this.getYforDate(dateString)))

        //let hoveredDay = this.formatDate(this.newMemoryDate)
        //let casesOnHoveredDay = this.parsedCases.find(c => c.dateString == hoveredDay).value
        //let y = this.scales.y(casesOnHoveredDay)
        //this.linePosition = [event.clientX,y]

        /*Vue.set(
          this.computedMemories.array[this.computedMemories.length-1],
          'date',
          this.formatDate(this.newMemoryDate))
        console.log(this.computedMemories.arr[this.computedMemories.length-1].date)*/
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
