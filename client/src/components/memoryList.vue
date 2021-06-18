<template>
    <div class="memoryList">
        <div style="text-align: right; margin-right: 1%"  v-if="orderedMemories.length > 1">
            <v-btn text  @click="changeSort('date')">date {{desc ? '↑' : '↓'}}</v-btn>
            <!--<v-btn text :class="[(sort == 'weight') ? 'bold' : '']" @click="changeSort('weight')">popularity</v-btn>-->
        </div>
        <transition-group name="list" tag="ul">

            <li v-for="(memory, i) in orderedMemories" :key="'memory-li-'+i" class="item">
                <memoryCard :memory="memory" display="separated" />
            </li>
        </transition-group>
    </div>
</template>


<script>
import memoryCard from './memoryCard.vue'

export default {
  components: {
      memoryCard
  },

  data () {
    return {
        sort: 'date',
        desc: true
    }
  },

  computed: {
    hashtag:   function() {return this.$store.state.activeHashtag},
    memories:   function() {return this.$store.state.memories},
    orderedMemories: function() {
        if(!this.memories) return null

        let memories = this.memories
        if(this.hashtag) memories = memories.filter(memory => memory.hashtag && memory.hashtag.includes(this.hashtag)) //filter memories if hashtag is active
            
        memories.sort((a,b) => {
            if(this.sort == 'date') {
                return new Date(b.date) - new Date(a.date);
            } else {
                return b.weight - a.weight
            }
        })

        if(this.sort == 'date' && this.desc) memories.reverse()

        return memories
        
    }
  },
 
  mounted () {
  },

  methods: {
      changeSort: function(type) {
          if(type == 'date') {
              this.sort = 'date'
              this.desc = !this.desc
          } else {
              this.sort = 'weight'
          }
      }
  }
}
</script>

<style scoped>
.memoryList {
    pointer-events: all;
}

ul, li {
    margin: 0;
    padding: 0;
    display: block;
}

li.item {
    margin-bottom: 20px;
    width: 99%
}


.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 1s;
}
</style>