<template>
  <svg :width="options.dimensions.width" :height="options.dimensions.height" v-if="mounted" z-index="5">
    
    <filter id="blurMe">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
    
    <g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${options.dimensions.height-options.dimensions.top-options.dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${options.dimensions.width-options.dimensions.right})`"></g>

    <path
      :d="caseLine"
      stroke-width="3"
      stroke-linecap="round" 
      fill="none"
      stroke="black"/>

    <g class="memories"  transform="translate(0,0)"> <!-- can go to component, actually.... -->
      <g v-if="beeswarm">
        <g v-for="memory, j in beeswarm.filter((e,i) => i < options.progress)" :key="j">
          <circle
          
            :cx="memory.x"
            :cy="memory.y"
            :class="{inactive: memory.inactive}"
            :r="memory.radius"
            fill="#FA5E2D"
            :filter="(options.overlay) ? 'url(#blurMe)' : ''"
            :opacity="opacity"

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
         </g><!-- circleMemories </g>-->
      </g>

      <!--<g v-for="(memory, k) in lineMemories" :key="'line-'+k" >
        <path v-if="memory.path" stroke-linecap="round" :opacity="opacity" stroke-dasharray="1 5" stroke-width="2" :d="memory.path" stroke="#FA5E2D" fill="none" />
      </g>-->
    </g>

        

  

    <!--<g class="dateSelector" @click="$emit('showForm', formatDate(newMemory.date))" v-if="dateSelector">-->
    <g class="datePicker" @click="$emit('toggleForm', formatDate(newMemory.date))"
     v-if="datePicker"
     :transform="`translate(${newMemory.position.x},0)`"> <!-- can go to own component -->
      <line y1="0" :y2="options.dimensions.height" x1="0" x2="0" stroke="#FA5E2D" stroke-width="2px"  stroke-dasharray="0"/>
      <circle r="40" cx="0" :cy="newMemory.position.y" fill="#FA5E2D" />
      <!--<text x="0" text-anchor="middle" :y="(newMemory.position.y - 5)">Click to add</text>-->
      <text x="0" text-anchor="middle" :y="(newMemory.position.y)">{{getRoughDate(newMemory.date)}}</text>
    </g>

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

export default {
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      lineGenerator: d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis),
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
    //dimensions: Object,
    cases: Array,
    memories: Array,
    datePicker: Boolean,
    //overlay: Boolean,

  },

  computed: {
    parsedCases: function() {
      return this.cases.map((c,i) => {
        return {
          dateString: c.d,
          date: this.parseDate(c.d),
          value: c.v,
          slope: (i>5) ? c.v - this.cases[i-6].v : 0 //helps computing the beeswarm's distance
        }
      })
    },

    scales: function() {
      if(!this.parsedCases && this.memories) return null

      let yDomain = [0,d3.max([50,d3.max(this.parsedCases, d=>d.value)])] //minimum of 50 cases to have a somewhat consistent layout
      let xDomain = d3.extent(this.parsedCases, d=>d.date)
      let radiusDomain = d3.extent(this.memories, d=>d.weight)

      let x = d3.scaleTime().domain(xDomain).range([this.options.dimensions.left,this.options.dimensions.width-this.options.dimensions.right])
      let y = d3.scaleLinear().domain(yDomain).range([this.options.dimensions.height-this.options.dimensions.bottom-this.options.dimensions.top,this.options.dimensions.top])
      let radius = d3.scaleLinear().domain(radiusDomain).range([3,4])
      
      return {x: x, y: y, radius: radius}
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

    circleMemories: function() {
      if(!this.memories && !this.scales) return null
      let arr = this.memories //create new arr, because reactivity (maybe, dunno, did not work without it)
      
      let slopeDomain = d3.extent(this.parsedCases, d=>d.slope)

      if(arr && arr.length > 0) { //compute x/y coordinates for all memories (before turning them into a beeswarm)
        //arr = arr.filter(memory => memory.date == memory.enddate) //only get memories that are only one day long
        arr.forEach((memory,i)=> {
          let slope = this.getLineElement(memory.date).slope
          let maxSlope = slope >= 0 ? slopeDomain[1] : slopeDomain [0] //if slope is negative, use negativ max to compute distance
          let sign = (i%2) ? -1 : 1 //split into a line above and one below
          let changeY = sign * (Math.abs(maxSlope) -  Math.abs(slope)) * (1/this.forceDistance) //change on y axis decreases as slope gets higher
          let changeX = sign * (maxSlope  - slope) * (1/this.forceDistance) //change on y axis decreases as slope gets higher
          memory.y = this.scales.y(this.getLineElement(memory.date).value) + changeY
          memory.x = this.scales.x(this.parseDate(memory.date)) + changeX
          memory.radius = this.scales.radius(memory.weight)
        })
      }
      //arr.forEach(m=>console.log(m.hidden))
      //console.log(arr.filter(m=>m.active))
      return arr
      
    },
    

    /*lineMemories: function() {
      if(!this.memories && !this.scales) {console.log(this.memories,this.scales); return null} 
      let arr = this.memories
      if(arr.length > 0) {
        arr = arr.filter(memory => memory.date != memory.enddate)
        arr.forEach((memory,i)=> {
          let segment = this.getLineSegment(memory.date,memory.enddate)
          if(segment.length > 0) segment.forEach(s => s.y = s.y - 5) 
          if(i==1)console.log(segment,this.lineGenerator(segment))
          memory.path = this.lineGenerator(segment)
        })
      }
      return arr
    },*/


    
  /*beeswarm: function(){
    if(!this.circleMemories) return null
   
    return 
  },*/
},

watch: {
  circleMemories: function(circleMemories) {
     let force = d3.forceSimulation(circleMemories)
      .force('forceX', d3.forceX(memory => memory.x).strength(.1))
      .force('forceY', d3.forceY(memory => memory.y).strength(.1))
      .force('collide', d3.forceCollide(d => d.radius + .5))
    for (let i = 0; i < 100; ++i) {
      force.tick()
    }
    
    this.beeswarm = force.nodes()
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

  beeswarm: function(arr) { //show circle on overlay after beeswarm changed
    let c = arr.filter(e=>e.active)[0]
    if(c) {
      this.currentMemory = c
       this.currentMemory.connector = `
        M${c.x} ${c.y}
        Q${(this.options.dimensions.width/2)} ${c.y}
        ${(this.options.dimensions.width/2)} ${(this.options.dimensions.height/2)}`;
    }
  }
},

  async mounted() {
    this.mounted = true;
    document.addEventListener('mousemove', this.onMouseMove)
    /*document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)*/
  },

  methods: {
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

    //alternative interaction with dragging a line
    /*onMouseMove: function(event) { //follow line
      if(this.dateSelector) {
        let endDate = this.scales.x.invert(event.clientX)
        let dateString = this.formatDate(endDate)
        let value = this.scales.y(this.getLineElement(dateString).value)

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
    },*/
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
