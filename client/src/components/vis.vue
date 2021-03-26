<template>
  <svg :width="dimensions.width" :height="dimensions.height" v-if="scales.x && cases && mounted">
    <!-- axes and baseline chart -->
    <g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${dimensions.height-dimensions.top-dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${dimensions.width-dimensions.right})`"></g> 
    <path
      :d="caseLine"
      stroke-width="3"
      stroke-linejoin="round" 
      fill="none"
      stroke="black"/>
    
    <!-- beeswarm plot and hashtag network -->
    <g class="beeswarm" v-if="beeswarm">
      <g class="circles">
      <path
        v-for="circle in beeswarm.filter((e,i) => i < progress && e.isMemory)" :key="'circle-'+circle.id"
        :d="circle.d"
        :transform="`translate(${circle.x},${circle.y})`"
        :id="'circle-'+circle.id"
        :opacity="opacity"
        
        :class="{inactive: (activeHashtag && activeHashtag != circle.hashtag)}"
        @click="click(circle.id)"
        @mouseover="hover(circle,$event)"
        @mouseout="hover(circle,$event)"
        />
      </g>

      <g v-if="hashtags && activeMemories.length <   2 && !activeHashtag && progress > beeswarm.filter(e => e.isMemory).length - 10" class="hashtags">
        <g v-for="(link,i) in hashtags" :key="'label-'+i">
          <line stroke="#FA5E2D" stroke-width=".5" :x1="link.source.x" :y1="link.source.y" :x2="link.target.x" :y2="link.target.y+1" />
          <text
            fill="#FA5E2D"
            :x="link.target.x"
            :text-anchor="link.target.anchor"
            :y="link.target.y"
            @click="click(link.target.id)">{{link.target.text}}</text>
        </g>
      </g>
    </g>

  <g v-if="activeMemories">
    <g v-for="(link, i) in memoryLinks" :key="'card-'+i">
      <line stroke="#FA5E2D"
        :x1="link.source.x"
        :y1="link.source.y"
        :x2="link.target.x"
        :y2="link.target.y"
        />
      <foreignObject :width="memoryBox.width + 10" :height="memoryBox.height+10" :x="link.target.x-memoryBox.width/2" :y="link.target.y-memoryBox.height/2" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
        <memoryCard :dimensions="memoryBox" :memory="link.target.memory"/> <!-- use component to avoid rendering issues with foreignObecht https://nrlzzszpdtldzzbvyll4js5rom-hw4pqoxzcs7yk-stackoverflow-com.translate.goog/questions/65321012/vuetify-v-menu-component-inserted-into-svg-is-not-displayed-in-browser -->   
      </foreignObject>
      
    </g>
  </g>

    <!-- show datepicker element when adding new memories --> 
    <Datepicker
      v-if="newMemory.showForm"
      :date="newMemory.date"
      />
  </svg>
</template>

<script>
import * as d3 from 'd3'
import Datepicker from './datepicker.vue'
import memoryCard from './memoryCard.vue'


export default {
  components: {
    Datepicker,
    memoryCard
  },
  data () {
    return {
      mounted: false,
      visibleHashtags: 10,
      opacity: 0.8, //circle opacity when not hoveredü
      lineGenerator: d3.line().x(d => d.x).y(d => d.y),
      memoryBox: {
        width: 300,
        height: 150
      }
    }
  },

  props: {
    progress: Number,
    newMemory: Object,
  },

  computed: {
    dimensions: function() {return this.$store.state.dimensions},
    cases:      function() {return this.$store.state.cases},
    beeswarm:   function() {return this.$store.getters.beeswarm},
    activeHashtag: function() {return this.$store.state.activeHashtag},
    scales:     function() {return this.$store.state.scales},
    activeMemories: function() {return this.$store.getters.activeMemories},

    memoryLinks: function() {      
      if(!this.activeMemories) return null  
      
      let nodes = []
      let links = []
      this.activeMemories.forEach(memory => {
        nodes.push({type: "circle", fx: memory.x, fy: memory.y})
        nodes.push({type: "box", x: memory.x-this.memoryBox.width/2, y: memory.y-this.memoryBox.height/2, memory: memory})
        links.push({source: nodes.length-2, target: nodes.length-1})
      })
      
      var simulation = d3.forceSimulation(nodes) //generate force directed simulation
      .force('charge', d3.forceManyBody().strength(1))
      .force('link', d3.forceLink().links(links)) 
      .force('collide', d3.forceCollide(100)) //dont collide with other text labels, but be close to button.labels
      for(let i = 0; i <= 10; i++) {
        simulation.tick()
      }

      //bounding box for lazy people
      links.forEach(link => {
        if(link.target.y < this.memoryBox.height/2) link.target.y = this.memoryBox.height/2
        if(link.target.x < this.memoryBox.width/2) link.target.x = this.memoryBox.width/2
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

    hashtags: function() { //create a force-link network of memories and labels to avoid collisions
      if(!this.beeswarm) return null
      let nodes = []
      let links = []
      
      //create node-link network of ALL bubbles (to avoid collision) and the hashtags of the most weighing memories
      const sorted = [...this.beeswarm].sort((a,b) => b.weight - a.weight);
      sorted.forEach(memory => {
        nodes.push({type: "circle", fx: memory.x, fy: memory.y}) //source 
        if(memory.hashtag && links.length < this.visibleHashtags) {     
          nodes.push({type: "label", x: memory.x, y:memory.y, text: memory.hashtag, id: memory.id}) //target
          links.push({source: nodes.length-2, target: nodes.length-1}) //link the two
          
        }
      })

      var simulation = d3.forceSimulation(nodes) //generate force directed simulation
      .force('charge', d3.forceManyBody().strength(1))
      .force('link', d3.forceLink().links(links)) 
      .force('collide', d3.forceCollide(17)) //dont collide with other text labels, but be close to button.labels
      for(let i = 0; i <= 10; i++) {
        simulation.tick()
      }

      links.forEach(link => {
        link.target.anchor = (link.target.x >= link.source.x) ? "start" : "end"
      })  
      return links
    }
  },

  watch: {
  },

  mounted() {
    this.mounted = true
    
  },

  methods: {
    hover: function(circle,event) { //hovering circles
      if(!this.datePicker) {  //disable hover when memory adding is in progress 
        let scale = (event.type == 'mouseover') ? 2 : 1
        d3.select(event.target).transition("50").attr('transform',`translate(${circle.x},${circle.y}) scale(${scale})`)
      }
    },
    click: function(id) {
      this.$store.commit('setActiveMemories',id)
    }
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
    path.inactive {
    opacity: .2 !important;
    fill: grey !important;
    pointer-events: none;  
    }

    .beeswarm path {
      fill: #FA5E2D;
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