<template>
  <svg width="100%" height="100%">
    <defs>
      <pattern
        id="innerGrid"
        :width="innerGridSize"
        :height="innerGridSize"
        patternUnits="userSpaceOnUse"
      >
        <rect
          width="100%"
          height="100%"
          fill="none"
          stroke="#CCCCCC7A"
          stroke-width="0.5"
        />
      </pattern>
      <pattern
        id="grid"
        :width="gridSize"
        :height="gridSize"
        patternUnits="userSpaceOnUse"
      >
        <rect
          width="100%"
          height="100%"
          fill="url(#innerGrid)"
          stroke="#CCCCCC7A"
          stroke-width="1.5"
        />
      </pattern>
      <!--<g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${dimensions.height-dimensions.top-dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${dimensions.width-dimensions.right})`"></g> -->
    </defs>

    <!--<path
      v-if="caseLine"
      :d="caseLine"
      class="caseLine"
      stroke-width="3"
      stroke-linejoin="round"
      fill="none"
      stroke="black"
    />-->
  </svg>
</template>

<script>
//import Vue from 'vue'
import * as d3 from 'd3'
//import Datepicker from './datepicker.vue'
//import memoryCard from './memoryCard.vue'


export default {
  components: {
    //Datepicker,
    //memoryCard
  },
  data () {
    return {
        memoryAmount: 100, 
        
        width: 1024,
        height: 768,
        foreignObject: {
          width: 10,
          height: 10,
        },
        gridSize: 100,
        selections: {},
        simulation: null,
        forceProperties: {
          center: {
            x: 0.5,
            y: 0.5
          },
          charge: {
            enabled: false,
            strength: -700,
            distanceMin: 1,
            distanceMax: 5
          },
          collide: {
            enabled: true,
            strength: .7,
            iterations: 1,
            radius: 5
          },
          forceX: {
            enabled: true,
            strength: 0.01,
          },
          forceY: {
            enabled: true,
            strength: 0.0,
          },
          link: {
            enabled: true,
            distance: 1,
            iterations: 1
          }
        },
        data: {
          nodes: [],
          links: [],
        },

    }
  },

  props: {
    progress: Number,
    newMemory: Object,
  },

  computed: {
    dimensions: function() {return this.$store.state.dimensions},
    activeHashtag: function() {return this.$store.state.activeHashtag},
    nodes: function() {return this.$store.getters.memories.filter((x,i) => i<1000)},
    links() {
        if(!this.nodes) return null
        let links = []
        this.nodes.forEach((node,i) => {
            if(i%2 == 0) links.push({source: i, target: i+1})
        })
        return links
    },
    caseLine() {return this.$store.getters.caseLine},
    innerGridSize() { return this.gridSize / 10 },
    

  },

  created() {
      this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide())
        .force("forceX", d3.forceX())
        .force("forceY", d3.forceY())
        .on("tick", this.tick)   

    
  },

  mounted() {
    this.selections.svg = d3.select(this.$el)

    
    this.zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', this.zoomed)
    this.selections.svg.call(this.zoom)

    this.selections.grid = this.selections.svg.append('rect')
        .attr('x', '-10%')
        .attr('y', '-10%')
        .attr('width', '410%')
        .attr('height', '410%')
        .attr('fill', 'url(#grid)')
        .attr("pointer-events","none")

    this.selections.caseLine = this.selections.svg.append("g")
    this.selections.graph = this.selections.svg.append("g").attr("class","graph")

    this.updateData()
    this.updateForces()


  },

  methods: {
    tick() {
        const transform = d => {
          return "translate(" + d.x + "," + d.y + ")";
        }

        const transformForeignObject = d => {
          return "translate(" + (d.x - this.foreignObject.width/2) + "," + (d.y - this.foreignObject.height/2) + ")"; 
        }

        const link = d => {
          return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;
        }

        const graph = this.selections.graph
        graph.selectAll("path").attr("d", link).attr("stroke","black")
        graph.selectAll("circle").attr("transform", transform)
        graph.selectAll("foreignObject").attr("transform", transformForeignObject)
        //graph.selectAll("text").attr("transform", transform)
      },
    
    updateData() {
        this.simulation.nodes(this.nodes)
        this.simulation.force("link").links(this.links)
        
        this.selections.graph.selectAll("path")
            .data(this.simulation.force("link").links())
            .enter().append("path")
            .attr("opacity",1)
            .attr("stroke-width",.1)
            .attr("id", d => "link-" + d.source.id)
        //.exit().remove()

        
        /*this.selections.graph.selectAll("circle")
            .data(this.simulation.nodes().filter(d=>d.isMemory))
            .enter().append("circle")
            .attr("r", 6)
            .attr("opacity", 0)
            //.attr("id", d => "circle-" + d.id)
            .on("mouseover", this.mouseover)
            .on("mouseout", this.mouseout)
            .call(d3.drag()
                .on('start', this.nodeDragStarted)
                .on('drag', this.nodeDragged)
                .on('end', this.nodeDragEnded))
            //.exit().remove()*/

        const fo = this.selections.graph.selectAll("g")
            .data(this.simulation.nodes().filter(d=>d.isMemory))
            .enter()
            
            //fo.append("rect").
            fo.append("foreignObject")
            .attr("requiredExtensions","http://www.w3.org/1999/xhtml")
            .attr("width", this.foreignObject.width)
            .attr("height", this.foreignObject.height)
            //.attr("id", d => "circle-" + d.id)
            .on("mouseover", this.mouseover)
            .on("mouseout", this.mouseout)
            
            .append("xhtml:p").html(d=> d.comment)
            .on("click", this.click)
            .call(d3.drag()
                .on('start', this.nodeDragStarted)
                .on('drag', this.nodeDragged)
                .on('end', this.nodeDragEnded))
            //.exit().remove()    
            

        this.selections.caseLine.append("path")
            .attr("d",this.caseLine)
            .attr("stroke","black")
            .attr("stroke-width",1)
            .attr("fill","none")

        /*this.selections.graph.selectAll("text")
          .data(this.simulation.nodes().filter(d=>d.isMemory))
        .enter().append("text")
          .attr("x", 0)
          .attr("font-size",.5)
          .attr("y", ".31em")
          .attr("text-anchor", "start")
          .selectAll("tspan")
          .data(d=>this.wrap(d.comment))
          .enter()
          .append("tspan").text(d => d)
          .attr('dy','1.1em')
          .attr('x','0')*/
          

        this.simulation.alpha(1).restart();
        
        
        
      },

    mouseover(event,circle) {
        d3.select("#link-"+circle.id).transition().attr("opacity",1)
    },
    mouseout(event,circle) {
        d3.select("#link-"+circle.id).transition().attr("opacity",0)
    },
    click(event,foreignObject) {
      console.log(foreignObject)
    },

      

      updateForces() {
        const { simulation, forceProperties} = this
        
        simulation.force("charge")
          .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
          .distanceMin(forceProperties.charge.distanceMin)
          .distanceMax(forceProperties.charge.distanceMax);
        simulation.force("collide")
          .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
          .radius(forceProperties.collide.radius)
          .iterations(forceProperties.collide.iterations);
        simulation.force("forceX")
          .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
          .x(d=>d.x);
        simulation.force("forceY")
          .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
          .y(d=>d.y);
        simulation.force("link")
          .distance(forceProperties.link.distance)
          .iterations(forceProperties.link.iterations);

        // updates ignored until this is run
        // restarts the simulation (important if simulation has already slowed down)
        simulation.alpha(1).restart();2
      },


      zoomed(event) {
        
        const transform = event.transform;
        
        // The trick here is to move the grid in a way that the user doesn't perceive
        // that the axis aren't really moving
        // The actual movement is between 0 and gridSize only for x and y
        const translate = transform.x % (this.gridSize * transform.k) + ',' + transform.y % (this.gridSize * transform.k)
        this.selections.grid.attr('transform', 'translate(' +translate + ') scale(' + transform.k + ')');
        this.selections.caseLine.attr('transform', transform);
        this.selections.graph.attr('transform', transform)

        // Define some world boundaries based on the graph total size
        // so we don't scroll indefinitely
        const graphBox = this.selections.graph.node().getBBox()
        const margin = 200
        const worldTopLeft = [graphBox.x - margin, graphBox.y - margin]
        const worldBottomRight = [
          graphBox.x + graphBox.width + margin,
          graphBox.y + graphBox.height + margin
        ]
        this.zoom.translateExtent([worldTopLeft, worldBottomRight])
      },




  },

      watch: {
      nodes: {
          handler() {
              this.updateData()
              this.updateForces()
          }
      },
      /*caseLine: {
          //immediate: true,
          handler() {
              
          }
      },*/
      forceProperties: {
        handler() {
          this.updateForces()
        },
        deep: true
      }
    },

  /*directives: { //axis computation
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
  }*/
}
</script>

<style>
path.link {
  stroke: black;
  stroke-width: 1;
}

p {
    font-size: 1pt;
    line-height: 1em;
}
</style>