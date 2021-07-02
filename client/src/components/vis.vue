<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="scales.x && cases && mounted" style="overflow: visible">
    <!-- axes and baseline chart -->
    <g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${dimensions.height-dimensions.top-dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${dimensions.width-dimensions.right})`"></g> 
    <text :transform="`translate(${dimensions.width-dimensions.right+10},${dimensions.height-dimensions.top})`" opacity=".5" text-anchor="end" font-size=".5em">
      <tspan x="0">rolling average</tspan>
      <tspan x="0" dy="1.2em">of new cases</tspan>
      <tspan x="0" dy="1.2em">per 100.000</tspan>
    </text>
    <path
      :d="caseLine"
      stroke-width="3"
      stroke-linejoin="round" 
      fill="none"
      stroke="black"/>
    
    <!-- beeswarm plot -->
    <g class="beeswarm" v-if="beeswarm[0] && iHaveWaitedASecondForTheDataToBeThereBecauseSomehowThisFixesThings">
      <g class="tutorial" v-if="!consent && progress < 1 && display != 'separated'">
        <rect width="200" height="50" fill="rgba(254,232,194,.7)" :x="beeswarm[0].x-255" :y="beeswarm[0].y-75" />
        <line stroke="#FA5E2D" stroke-width=".5" :x1="beeswarm[0].x-5" :y1="beeswarm[0].y-5" :x2="beeswarm[0].x-50" :y2="beeswarm[0].y-50" />
        <text
          :y="beeswarm[0].y-50"
          @click="$emit('demoClick')"
          font-size=".8em"
          text-anchor="end">
            <tspan v-if="display == 'embedded'" :x="beeswarm[0].x-55">A dot is a person's memory.</tspan>
            <tspan v-if="display == 'contextual'" :x="beeswarm[0].x-55">A dot is a policy response.</tspan>
            <tspan dy="1.2em" :x="beeswarm[0].x-55">Click to read them.</tspan>
        </text>
        <path 
          :d="beeswarm[0].d"
          fill="#FA5E2D"
          :transform="`translate(${beeswarm[0].x},${beeswarm[0].y})`" 
          :opacity="opacity"
          @click="$emit('demoClick')"
        />
      </g>
      <g class="circles">
      <path
        v-for="circle in beeswarm.filter((e,i) => i < progress && e.isMemory)" :key="'circle-'+circle.id"
        :d="circle.d"
        :transform="`translate(${circle.x},${circle.y})`"
        :id="'circle-'+circle.id"
        
        :opacity="(activeMemories.findIndex(memory => memory.id == circle.id) !== -1) ? 1 : opacity"
        :fill="(activeMemories.findIndex(memory => memory.id == circle.id) !== -1) ? '#E63700' : '#FA5E2D'"
        :class="{inactive: activeHashtag && circle.hashtag && !circle.hashtag.includes(activeHashtag)}"
        @click="click(circle.id)"
        @mouseover="hover(circle,$event)"
        @mouseout="hover(circle,$event)"
        />
      </g>
    </g>

  <transition-group name="cards" tag="g" v-if="activeMemories && progress > beeswarm.filter(e => e.isMemory).length - 10">
    <g v-for="(link, i) in memoryLinks" :key="'card-'+i">
      <line
        stroke="#E63700"
        :x1="link.source.x"
        :y1="link.source.y"
        :x2="link.target.x"
        :y2="link.target.y + 40"
        :key="'line'+i"
        />
      <foreignObject
        :width="boxWidth"
        height="1"
        style="overflow: visible"
        :x="link.target.x - (boxWidth/2)"
        :y="link.target.y"
        :key="'fO'+i"
        requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <memoryCard :width="boxWidth" :display="display" :memory="link.target.memory"/> <!-- use component to avoid rendering issues with foreignObecht https://nrlzzszpdtldzzbvyll4js5rom-hw4pqoxzcs7yk-stackoverflow-com.translate.goog/questions/65321012/vuetify-v-menu-component-inserted-into-svg-is-not-displayed-in-browser -->   
      </foreignObject>
    
    </g>
  </transition-group>

    <!-- show datepicker element when adding new memories --> 
    <Datepicker v-if="showDatepicker && this.display == 'embedded'" />
  </svg>
</template>

<script>
import * as d3 from 'd3'
import Datepicker from './datepicker.vue'
import memoryCard from './memoryCard.vue'
import interactionService from '@/services/interactionService'




export default {
  components: {
    Datepicker,
    memoryCard
  },
  data () {
    return {
      mounted: false,
      iHaveWaitedASecondForTheDataToBeThereBecauseSomehowThisFixesThings: false,
      visibleHashtags: 10,
      opacity: 0.8, //circle opacity when not hoveredü
      lineGenerator: d3.line().x(d => d.x).y(d => d.y),
      boxWidth: 350,
    }
  },

  props: {
    progress: Number,
    newMemory: Object,
    display: String,  
    consent: Boolean
  },

  computed: {
    dimensions: function() {return this.$store.state.dimensions},
    cases:      function() {return this.$store.state.cases},
    beeswarm:   function() {return this.$store.getters.beeswarm},
    activeHashtag: function() {return this.$store.state.activeHashtag},
    scales:     function() {return this.$store.state.scales},
    activeMemories: function() {return this.$store.getters.activeMemories},
    showDatepicker: function() {return this.$store.state.newMemory.datepicker},
    memoryLinks: function() {      
      if(!this.activeMemories) return null  

      
      
      let nodes = []
      let links = []
      this.activeMemories.forEach(memory => {
        nodes.push({type: "circle", fx: memory.x, fy: memory.y})
        nodes.push({type: "box", x: memory.x-this.boxWidth/2, y: memory.y-10, height: 0, memory: memory})
        links.push({source: nodes.length-2, target: nodes.length-1})
      })
      
      var simulation = d3.forceSimulation(nodes) //generate force directed simulation
      .force('charge', d3.forceManyBody().strength(1))
      .force('link', d3.forceLink().links(links)) 
      .force('collide', d3.forceCollide(this.boxWidth / 2)) //dont collide with other text labels, but be close to button.labels
      for(let i = 0; i <= 100; i++) {
        simulation.tick()
      }


      //bounding box for lazy people
      links.forEach(link => {
        let bottomClearance = 100 //boxes of what size should be fully visible? (variable height, computing it happens insie the foreignObject and I'm lazy)
        if(link.target.x < this.boxWidth/2) link.target.x = this.boxWidth/2 + 5
        if(link.target.x > this.dimensions.width - this.boxWidth/2) link.target.x = this.dimensions.width - this.boxWidth/2 - 10 
        if(link.target.y < 0) link.target.y = 5
        if(link.target.y > this.dimensions.height - bottomClearance) link.target.y = this.dimensions.height - bottomClearance -5
      })
    
      return links  
    },

    caseLine: function() {
      if(!this.scales || !this.cases) return false
      let arr = this.cases.map(c => { 
        c.x = this.scales.x(c.date)
        c.y = this.scales.y(c.value)
        return c;
      })
      return this.lineGenerator(arr)
    },
  },

  watch: {
  },

  mounted() {
    this.mounted = true
    this.$nextTick(() => {
      setTimeout(() => {this.iHaveWaitedASecondForTheDataToBeThereBecauseSomehowThisFixesThings = true}, 1)
    }) 
    
    
  },

  methods: {
    hover: function(circle,event) { //hovering circles
      if(!this.datePicker) {  //disable hover when memory adding is in progress 
        let scale = (event.type == 'mouseover') ? 2 : 1
        d3.select(event.target).transition("50").attr('transform',`translate(${circle.x},${circle.y}) scale(${scale})`)
      }
    },
    click: function(id) {
      
      let event = this.display == 'embedded' ? 'openMemory' : 'openContext'
      interactionService.sendInteraction({event: event, element: id})
      this.$store.commit('setActiveMemories',id)
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
            .style("text-anchor", "start")
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
          axis.selectAll(".tick text")
            .attr("opacity",.3)
          break;
      }
    }
  }
}
</script>

<style scoped>
.card-item {
  display: inline-block;
  margin-right: 10px;
}
.card-enter-active, .card-leave-active {
  transition: all 1s;
}
.card-enter, .card-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.card-move {
  transition: transform 1s;
}
.card-fade-enter-active {
  transition: all .3s ease;
}
    path.inactive {
    opacity: .2 !important;
    fill: grey !important;
    pointer-events: none;  
    }

    .beeswarm path {
      cursor: pointer;
    }

  .hashtags text {
    cursor: pointer;
    font-size: 9pt;
    pointer-events: all;
    font-weight: bold;
    text-decoration: underline;
  }
</style>