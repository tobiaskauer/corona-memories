<template>
  <svg :width="options.dimensions.width" :height="options.dimensions.height">
    
    <lines
      :dimensions="options.dimensions"
      :scales="scales"
      :cases="parsedCases" />

    <g v-if="force" class="memories"  transform="translate(0,0)"> <!-- can go to component, actually.... -->
      <circle
        
        v-for="circle, i in parsedMemories.filter((e,i) => i < options.progress)" :key="'circle-'+i"
        :cx="circle.x"
        :cy="circle.y"
        :class="{inactive: circle.inactive}"
        :r="circle.radius"
        fill="#FA5E2D"
        :opacity="opacity"
        @click="$emit('showMemory',circle)"
        @mouseover="hover(circle,$event)"
        @mouseout="hover(circle,$event)" />
         
      <!-- show hashtag labels (once all memories are visible) -->
      <g v-if="hashtagLabels && options.progress >= parsedMemories.length - 10">
        <g v-for="(link,i) in hashtagLabels" :key="'label-'+i" pointer-events="none">
          <line stroke="#FA5E2D" stroke-width=".5" :x1="link.source.x" :y1="link.source.y" :x2="link.target.x" :y2="link.target.y+1" />
          <text style="text-decoration: underline;" font-weight="bold" fill="#FA5E2D" font-size="11" :x="link.target.x" :text-anchor="link.target.anchor" :y="link.target.y">{{link.target.text}}</text>
        </g>
      </g>
    </g>


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
//import {annotation, annotationCallout} from "d3-svg-annotation"
import lines from './lines'

export default {
  components: {
    lines,
  },
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      lineGenerator: d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis),
      force: null,
      opacity: 0.8, //circle opacity when not hovered
      forceDistance: 8, //distance of reactions to line
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

      return this.memories.map((memory,i) => {
        let sign = (i%2) ? 1 : -1
        memory.Date = this.parseDate(memory.date)
        memory.x = this.scales.x(memory.Date)
        memory.value = this.getLineElement(memory.date).value
        memory.y = this.scales.y(memory.value) + this.forceDistance * sign
        memory.radius = this.scales.radius(memory.weight)
        memory.hashtag = (memory.comment.match(/#[a-z]+/gi)) ? (memory.comment.match(/#[a-z]+/gi))[0] : null 

        return memory
      })
    },

    //generate force directed hashtags of X most weightened labels
    hashtagLabels() {
      if(!this.memories) return null
      this.scales //mention to force recomputation if dimensions change

      let nodes = []
      let links = [] //

      let memoriesWithTags = this.memories.filter(memory => memory.hashtag && !memory.inactive) //all active memories that have hashtags
      
      let latestHashtag = [...memoriesWithTags].sort((a,b) => b.Date - a.Date)[0] //the latest memory that has a hashtag
      let selectedTags = memoriesWithTags.sort((a,b) => b.weight - a.weight).slice(0,10) //the X most weightened labels
      selectedTags.push(latestHashtag) //the newest one (to put them into the view)

      selectedTags.forEach((memory,i) => { //create node-link data
          nodes.push({type: "circle", fx: memory.x, fy: memory.y}) //origin
          nodes.push({type: "label", text: memory.hashtag}) //target
          links.push({source: i*2, target: i*2+1}) //link the two
        })

        var simulation = d3.forceSimulation(nodes) //generate force directed simulation
        .force('charge', d3.forceManyBody().strength(-0))
        .force('link', d3.forceLink().links(links))
        //.force('forceY', d3.forceY())
        .force('collide', d3.forceCollide(node => {return (node.text) ? node.text.length * 2 : 50}))

        for(let i = 0; i <= 200; i++) {
          simulation.tick()
        }

        links.forEach(link => {
          link.target.anchor = (link.target.x > link.source.x) ? "start" : "end"
        })
      return links

    },
  },

  watch: {
    parsedMemories: function(memories) {
      this.releaseTheBees(memories)
   },

    hashtag: function(newHashtag){
      if(!this.memories) return null
      this.memories.forEach((memory,i) => {
        if(newHashtag && !memory.comment.includes(newHashtag)) {
          Vue.set(this.memories[i],'inactive',true)
        } else {
          Vue.set(this.memories[i],'inactive',false)
        }
      })
    },

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

  async mounted() {
    this.releaseTheBees(this.memories)
    document.addEventListener('mousemove', this.onMouseMove)
  },

  methods: {
    releaseTheBees: function(memories) {
      
      this.force = d3.forceSimulation(memories)
      .force('forceX', d3.forceX(memory => memory.x).strength(.1))
      .force('forceY', d3.forceY(memory => memory.y).strength(.1))
      .force('collide', d3.forceCollide(d => d.radius + .5))

      for(let i = 0; i <= 20; i++) {
        this.force.tick()
      }
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
      if(date.getDate() <= 20) rough = "Mid"
      if(date.getDate() <= 10) rough = "Early"
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

  /*updated: function() {
    console.log("foo")
      this.force.tick()
  },*/
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