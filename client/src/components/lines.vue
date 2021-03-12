<template>
  <g>
    <!-- Axes -->
    <g class="axis xAxis" v-axis:x="scales" :transform="`translate(0,${dimensions.height-dimensions.top-dimensions.bottom+10})`"></g>
    <g class="axis yAxis" v-axis:y="scales" :transform="`translate(${dimensions.width-dimensions.right})`"></g>

    <!-- line that shows acses -->
    <path
      :d="caseLine"
      stroke-width="3"
      stroke-linejoin="round" 
      fill="none"
      stroke="black"/>
    </g>
</template>

<script>
import * as d3 from 'd3'

export default {
  data () {
    return {
      parseDate: d3.utcParse("%Y-%m-%d"),
      formatDate: d3.timeFormat("%Y-%m-%d"),
      lineGenerator: d3.line().x(d => d.x).y(d => d.y),//.curve(d3.curveBasis),
    }
  },

  props: {
    dimensions: Object,
    cases: Array,
    scales: Object,
  },

  computed: {
     //create line for cases to be drawn
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
