<template>
  <svg :width="options.dimensions.width" :height="options.dimensions.height">
    <!-- axes and baseline chart -->
    <lines 
      :dimensions="options.dimensions"
      :scales="scales"
      :cases="parsedCases" />
    
    <!-- beeswarm plot and hashtag network -->
    <beeswarm
        v-if="parsedCases && parsedMemories && scales"
        :parsedCases="parsedCases"
        :parsedMemories="parsedMemories"
        :scales="scales"  
        :hashtag="hashtag"
        :progress="options.progress"
      />

    <!-- show datepicker element when adding new memories --> 
    <Datepicker
      v-if="newMemory.showForm"
      :scales="scales"
      :parsedCases="parsedCases"
      :date="newMemory.date"
      />

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
//import Vue from 'vue'
import * as d3 from 'd3'
import lines from './lines'
import beeswarm from './beeswarm.vue'
import Datepicker from './datepicker.vue'


export default {
  components: {
    lines,
    Datepicker,
    beeswarm,
  },
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),

      //datePickerStopMoving: false,
      currentMemory: null, //when currently displaying a memory, pick the right one to highlight
    }
  },

  props: {
    options: Object,
    hashtag: String,
    cases: Array,
    memories: Array,
    newMemory: Object,
  },

  computed: {
    parsedCases: function() {
      return this.cases.map((c) => {
        return {
          dateString: c.d,
          date: this.parseDate(c.d),
          value: c.v,
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
      let radius = d3.scaleLinear().domain(radiusDomain).range([2,6])
      
      return {x: x, y: y, radius: radius}
    },

    parsedMemories: function() {
      if(!this.memories) return null

      this.scales //mention to force recomputation if dimensions change
      
      let memories = this.memories.map((memory) => {
        memory.date = this.parseDate(memory.dateString)
        memory.x = this.scales.x(memory.date)
        memory.value = this.getLineElement(memory.date).value
        memory.y = this.scales.y(memory.value)
        memory.radius = this.scales.radius(memory.weight)
        memory.hashtag = (memory.comment.match(/#[a-z]+/gi)) ? (memory.comment.match(/#[a-z]+/gi))[0] : null 
        
        return memory
      })
      return memories
    },
  },

  watch: {
    memories: function(arr) { //show circle on overlay after beeswarm changed
      let c = arr.filter(e=>e.active)[0]
      if(c) {
        this.currentMemory = c
         this.currentMemory.connector = `
          M${c.x} ${c.y}
          Q${(this.options.dimensions.width/2)} ${c.y}
          ${(this.options.dimensions.width/2)} ${(50)}`;
      }
    }
  },

  mounted() {
    
  },

  methods: {
    getLineElement: function(date) { //get case element from date
      let dateString = (typeof date == "string") ? date : this.formatDate(date) 
      let index = this.parsedCases.findIndex(c => c.dateString == dateString)
      let valueOnMemoryDate = (index !== -1) ? this.parsedCases[index]  : {value: 0}  
      return valueOnMemoryDate ? valueOnMemoryDate : null
    },
  },
}
</script>

<style scoped>

</style>