<template>
    <g class="datePicker" @mousedown="mouseDown" @mouseup="mouseUp"
     :transform="`translate(${x},0)`"> 
      <line y1="0" :y2="height" x1="0" x2="0" stroke="#FA5E2D" stroke-width="2px"  stroke-dasharray="0"/>
      <circle r="40" cx="0" :cy="y" fill="#FA5E2D" />
      <text x="0" text-anchor="middle" :y="(y)" v-html="displayDate" />
    </g>
</template>

<script>
import * as d3 from 'd3'

export default {
    data () {
    return {
        formatDate: d3.timeFormat("%Y-%m-%d"),
        parseDate: d3.utcParse("%Y-%m-%d"),
        height: window.innerHeight,
        x: -100, //start out of view 
        y: -100,
        fixed: false,
    }
  },

  props: {

  },

  computed: {
    date: {
      set: function(newDate) {console.log(this.fixed);this.$store.commit('setNewMemoryDate',newDate)},
      get: function() {return this.$store.state.newMemory.date}
    },

    scales: function() {return this.$store.state.scales},
    cases: function() {return this.$store.state.cases},
    exactDate: function() {return this.$store.state.newMemory.exactDate},

    displayDate: function() {
      if(!this.date) return null
      if(this.exactDate) {
        return this.formatDate(this.date)
      } else {
        return this.getRoughDate(this.date)
      }
    },

    
  },

  mounted() {
      document.addEventListener('mousemove', this.onMouseMove)
  },

  methods: {
    onMouseMove: function(event) { //follow line
    
      if(!this.fixed) {
        if(event.clientX > this.scales.x.range()[0] && event.clientX < this.scales.x.range()[1]) { //check whether we are moving within vis boundaries to avoid errors
          this.date = this.scales.x.invert(event.clientX)
          this.x = event.clientX
          this.y = this.scales.y(this.getLineElement(this.date).value)
          //this.displayDate = stringDate

         
        }
      }
    },

    mouseUp: function() {
      this.fixed = true
    },

    mouseDown: function() {
      this.fixed = false
    },

    getLineElement: function(date) { //get case element from date
      let dateString = (typeof date == "string") ? date : this.formatDate(date)
      let valueOnMemoryDate = this.cases.find(c => c.dateString == dateString)
      return valueOnMemoryDate ? valueOnMemoryDate : null
    },

    getRoughDate: function(date) {
      if(!date) return null
      
      let rough = "Late "
      if(date.getDate() <= 20) rough = "Mid"
      if(date.getDate() <= 10) rough = "Early"
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()]
      let str = "<tspan>"+rough+"</tspan>"
      str += "<tspan x='0' dy='15'>"+month+"</tspan>"
      return str
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