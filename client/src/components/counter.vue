<template>
  <span>{{counter}}</span>
</template>

<script>
export default {
  data () {
    return {
        counter: 0,
    }
  },

 computed: {
      daysSinceStart: function() { //for animated counter
      let start = new Date("2020-01-22")
      let today = new Date()
      return Math.ceil((today-start) / (1000 * 60 * 60 * 24))
    }
 },

 mounted () {
     this.count()
 },

  methods: {
    count: function() {
      setTimeout(()  => {
        this.counter++
       if(this.counter <= this.daysSinceStart) this.count();
      }, 5);
    },
  }
}
</script>

<style scoped>
</style>
