<template>
    <g class="datePicker" @mousedown="mouseDown" @mouseup="mouseUp"
     :transform="`translate(${x},0)`"> 
      <line y1="0" :y2="height" x1="0" x2="0" stroke="#FA5E2D" stroke-width="2px"  stroke-dasharray="0"/>
      <circle r="40" cx="0" :cy="y" fill="#FA5E2D" />
      <text x="0" text-anchor="middle" :y="(y)">{{displayDate}}</text>
    </g>
</template>

<script>
import * as d3 from 'd3'
//import Vue from 'vue'

export default {
    data () {
    return {
        formatDate: d3.timeFormat("%Y-%m-%d"),
        parseDate: d3.utcParse("%Y-%m-%d"),
        height: window.innerHeight,
        x: -100, 
        y: -100,
        displayDate: null,
        fixed: false,
    }
  },

  props: {
    date: Object,
    scales: Object,
    parsedCases: Array,
  },

  computed: {
      /*displayDate: function() {
          if(!this.date) return null
          return (this.date.exact) ? this.formatDate(this.date) : this.getRoughDate(this.date)
      }*/
  },

  mounted() {
      document.addEventListener('mousemove', this.onMouseMove)
  },

  watch: {
    date: {
      deep: true,
      immediate: true,
      handler(newDate) {
        if(newDate.string != this.displayDate) {
          this.displayDate = newDate.string
          this.x = this.scales.x(this.parseDate(newDate.string))
          
        }
      }
    }
  },

  methods: {
    onMouseMove: function(event) { //follow line
      if(!this.fixed) {
        if(event.clientX > this.scales.x.range()[0] && event.clientX < this.scales.x.range()[1]) { //check whether we are moving within vis boundaries to avoid errors
          let date = this.scales.x.invert(event.clientX)
          let stringDate = this.formatDate(date)
          
          this.x = event.clientX
          this.y = this.scales.y(this.getLineElement(date).value)
          this.displayDate = stringDate

         
        }
      }
    },

    mouseUp: function() {
      this.fixed = true
      this.$parent.$emit('pickDate',{
        string: this.displayDate,
        exact: this.date.exact
      })
    },

    mouseDown: function() {
      this.fixed = false
    },

    getLineElement: function(date) { //get case element from date
      let dateString = (typeof date == "string") ? date : this.formatDate(date) 
      let valueOnMemoryDate = this.parsedCases.find(c => c.dateString == dateString)
      return valueOnMemoryDate ? valueOnMemoryDate : null
    },

    getRoughDate: function(date) {
      if(!date) return null
      
      let rough = "Late"
      if(date.getDate() <= 20) rough = "Mid"
      if(date.getDate() <= 10) rough = "Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()]
        
      return rough+" "+month
    },


  },
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

.datePicker text.strong {
  font-weight: bold;
}
</style>