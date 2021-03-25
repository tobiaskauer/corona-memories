<template>
    <g class="beeswarm">
      <!--<circle
        v-for="circle, i in circles.filter((e,i) => i < progress && e.isMemory)" :key="'circle-'+i"
        :cx="circle.x"
        :cy="circle.y"
        :class="{inactive: circle.inactive}"
        :r="circle.radius"
        fill="#FA5E2D"
        :opacity="0"
        @click="$parent.$emit('showMemory',circle.id)"
        @mouseover="hover(circle,$event)"
        @mouseout="hover(circle,$event)" />-->

      <path
        v-for="circle, i in circles.filter((e,i) => i < progress && e.isMemory)" :key="'circle-'+i"
       
        :d="circle.d"
        :transform="`translate(${circle.x},${circle.y})`"
        fill="#FA5E2D"
        stroke-linejoin="round"
        :opacity="opacity"
        :class="{inactive: circle.inactive}"
        @click="$parent.$emit('showMemory',circle.id)"
        @mouseover="hover(circle,$event)"
        @mouseout="hover(circle,$event)" />

      <g v-if="!hashtag && hashtagLabels && progress >= parsedMemories.length - 10">
        <g v-for="(link,i) in hashtagLabels" :key="'label-'+i" pointer-events="none">
          <line stroke="#FA5E2D" stroke-width=".5" :x1="link.source.x" :y1="link.source.y" :x2="link.target.x" :y2="link.target.y+1" />
          <text
            style="text-decoration: underline;"
            font-weight="bold"
            fill="#FA5E2D"
            font-size="11"
            :x="link.target.x"
            pointer-events="all"
            cursor="pointer "
            :text-anchor="link.target.anchor"
            :y="link.target.y"
            @click="$parent.$emit('showMemory',link.target.id)">{{link.target.text}}</text>
        </g>
      </g>
        </g>
</template>

<script>
import * as d3 from 'd3'
import Vue from 'vue'

export default {
    data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      opacity: 0.8, //circle opacity when not hovered
      forceDistance: 2, //distance of reactions to line
      hoverRadius: 10,
      force: null,
    }
  },

  props: {
    hashtag: String,
    parsedCases: Array,
    parsedMemories: Array,
    scales: Object,
    progress: Number,
  },

  computed: {
    circles: function() {
      if(!this.parsedMemories && this.parsedCases) return null
      
      let organicBubbles = this.parsedMemories.map(memory => {
        let r = memory.radius
        let wobbly = (v) => v + (Math.random() * 3 - 1.5 )
        let top = wobbly(r)
        let right = wobbly(r)
        let bottom = wobbly(r)
        let left = wobbly(r)


        let d = `
          M 0 ${-top}
          C ${right/2} ${-right} ${right} ${-right/2} ${right} ${0}
          C ${right} ${bottom/2} ${bottom/2} ${bottom} ${0} ${bottom}
          C ${-left/2} ${bottom} ${-left} ${left/2} ${-left} ${0}
          C ${-left} ${-top/2} ${-top/2} ${-top} ${0} ${-top}
        `

        return {
          d: d,
          radius: memory.radius,
          id: memory.id,
          isMemory: true,
          x: Math.floor(memory.x),
          y: Math.floor(memory.y)

        }
      })

      
      this.scales //mention to force recomputation if dimensions change
      let fakeMemories = this.parsedCases.map(day => { //generate some fixed invisible bubbles along the line chart
        return {
          fx: day.x,
          fy: day.y,
          isMemory: false,
          radius: this.forceDistance
        }
      })

      return organicBubbles.concat(fakeMemories)
    },

    hashtagLabels() {
      if(!this.parsedMemories) return null
      this.scales //mention to force recomputation if dimensions change

      let nodes = []
      let links = []

      let memoriesWithTags = this.parsedMemories.filter(memory => memory.hashtag && !memory.inactive) //all active memories that have hashtags
      
      let latestHashtag = [...memoriesWithTags].sort((a,b) => b.Date - a.Date)[0] //the latest memory that has a hashtag
      let selectedTags = memoriesWithTags.sort((a,b) => b.weight - a.weight).slice(0,10) //the X most weightened labels
      selectedTags.push(latestHashtag) //the newest one (to put them into the view)

      selectedTags.forEach((memory,i) => { //create node-link data
          nodes.push({type: "circle", fx: memory.x, fy: memory.y}) //origin
          nodes.push({type: "label", x: memory.x, y:memory.y, text: memory.hashtag, id: memory.id}) //target
          links.push({source: i*2, target: i*2+1}) //link the two
        })

        var simulation = d3.forceSimulation(nodes) //generate force directed simulation
        .force('charge', d3.forceManyBody().strength(.1))
        .force('link', d3.forceLink().links(links)) 
        .force('forceY', d3.forceY(d=>d.y + 100).strength(.7))
        .force('forceX', d3.forceX(d=>d.x -100).strength(0.1))
        .force('collide', d3.forceCollide(node => {return (node.text) ? node.text.length * 3 : 0})) //dont collide with other text labels, but be close to button.labels

        for(let i = 0; i <= 10; i++) {
          simulation.tick()
        }

        links.forEach(link => {
          link.target.anchor = (link.target.x > link.source.x) ? "start" : "end"
        })
      return links


    },
  },

  watch: {
    parsedMemories: {
      immediate: true,
      handler() {
        this.releaseTheBees()
      },
    },

    hashtag: function(newHashtag){ //watch hashtags to set bubbles to inactive
      if(!this.parsedMemories) return null
      this.parsedMemories.forEach((memory,i) => {
        if(newHashtag && !memory.comment.includes(newHashtag)) {
          Vue.set(this.parsedMemories[i],'inactive',true)
        } else {
          Vue.set(this.parsedMemories[i],'inactive',false)
        }
      })
    },
  },

  mounted() {
  },

  methods: {
    releaseTheBees: function() {

    this.force = d3.forceSimulation(this.circles)
      .force('forceX', d3.forceX(circle => circle.x).strength(.1))
      .force('forceY', d3.forceY(circle => circle.y).strength(.1))
      .force('collide', d3.forceCollide(circle => circle.radius + 1.5))

      for(let i = 0; i <= 20; i++) {
        this.force.tick()
      }
    },

    hover: function(memory,event) { //hovering circles
      if(!this.datePicker) {  //disable hover when memory adding is in progress
        let r = this.hoverRadius
        let opacity = 1
        if(event.type == 'mouseout') {
          r = memory.radius
          opacity = this.opacity
       }
       d3.select(event.target).transition("50").attr("r",r).attr("opacity",opacity)
      }
    },

  },
}
</script>

<style scoped>
    circle.inactive {
    opacity: .2 !important;
    fill: grey !important;
    pointer-events: none;  
    }
</style>