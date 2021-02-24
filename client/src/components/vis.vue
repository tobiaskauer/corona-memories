<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="mounted ">
      <text x="100" y="100">{{time}}</text>
      <path
        :d="line"
        stroke-width="3"
        fill="none"
        stroke="black"/>

    <g class="memories" v-if="beeswarm" transform="translate(0,0)">

      <g v-for="memory, j in beeswarm" :key="j">
      <!--<g v-for="memory, j in beeswarm.filter((e,i)=>i < time)" :key="j">-->
      
        <circle
          :cx="memory.x"
          :cy="memory.y"
          :opacity="opacity"
          :r="memory.weight"
          fill="#FA5E2D"
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
    


    <g class="showLine" v-if="showLine" :transform="'translate('+linePosition[0]+',0)'">
      <line stroke="black" x1="0" x2="0" :y1="(dimensions.height)" :y2="0" stroke-dasharray="2" stroke-width="2" />
      <g class="button" :transform="'translate(0,'+linePosition[1]+')'" @click="$emit('showForm', formatDate(newMemoryDate))">
        <circle r="15" cx="0" cy="0" fill="white" stroke="black" />
        <path d="M6 0H9V6H15V9H9V15H6V9H0V6H6V0Z" fill="#black" transform="translate(-7,-7)" />
        <text x="20" y="4" v-if="newMemoryDate">It was on {{formatDate(newMemoryDate)}}</text>
      </g>
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
import * as d3 from 'd3'

export default {
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      mounted: false,
      opacity: 0.7, //circle opacity when not hovered
      forceDistance: 6, //distance of reactions to line
      linePosition: [0,0],
      newMemoryDate: null,
      currentMemory: null,
      time: 1,
      
    }
  },

  props: {
    dimensions: Object,
    cases: Array,
    metric: String,
    memories: Array,
    showLine: Boolean,
    overlay: Boolean,

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

      //let yDomain = d3.extent(this.parsedCases, d=>d[this.metric])
      let yDomain = [0,d3.max([100,d3.max(this.parsedCases, d=>d[this.metric])])] //minimum of 100 cases to have a somewhat consistent layout
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
    /*this.$nextTick(() => {
      this.animate()
    })*/
  },

  methods: {
    hover: function(memory,event) { //hovering circles
      let r = 10
      let opacity = 1
      if(event.type == 'mouseout') {
        r = memory.weight
        opacity = this.opacity
      }
      d3.select(event.target).transition("50").attr("r",r).attr("opacity",opacity)
    },

    onMouseMove: function(event) { //follow line
      if(this.showLine && this.scales) {
        this.linePosition = [event.clientX,event.clientY]
        this.newMemoryDate = this.scales.x.invert(event.clientX)
      }
    },

    /*animate: function() {
      if(!this.memories) return null
      setTimeout(()  => {
        this.time++
       if(this.time <= this.memories.length) this.animate();
      }, .5);
    },*/
  }
}
</script>

<style scoped>

</style>
