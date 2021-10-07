<template>
  <v-app>
    <v-container>
    <v-data-table
				:headers="headers"
        :items="memories"
        :items-per-page="25"
        :item-class="itemRowBackground"
        sort-by="updatedAT"
        :sort-desc="true"
        class="elevation-2"
        dense
		> 
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Review Memories</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          
          <v-spacer></v-spacer>
          
          <v-alert
            v-if="status"
            type="success" dense 
          >{{status}}</v-alert>
          
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>Are you sure you want to<template v-if="item.flagged"> re-approve</template><template v-else> report and hide</template> this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="approve">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.updatedAT="{ item }">
        {{getDate(item.updatedAT)}}
      </template>
      <template v-slot:item.approve="{ item }">
        
         <v-btn icon @click="openDialog(item)">
        <v-icon
          small
          color="black"
        >
          <template v-if="item.flagged">
            mdi-flag-remove
          </template>
          <template v-else>
            mdi-flag-outline
          </template>
        </v-icon>
         </v-btn>

      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          click="initialize"
        >
          Reset
        </v-btn>
      </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue'
import memoryService from '@/services/memoryService'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)

export default {
  data () {
    return {
      headers: ["id", "updatedAT", "comment", "flagged", "approve"].map(e=>{return{text: e, 	value: e}}),
      memories: [],

			counter: 0,
      dialog: false,
      item: {},
      status: null,
      
    }
  },

  asyncComputed: {
    async asyncMemories() {
      return (await memoryService.getMemories({
        attributes: ["id", "updatedAT", "flagged", "comment", ],
        //order: [["updatedAT","DESC"]], //no need to do this in query, just sort table
        //flagged: true,
        })).data
    }
  },

  methods: {
    itemRowBackground: function (item) {
      return item.flagged ? "flagged" : ""
  },
    openDialog: function(item) {
      this.dialog = true
      this.item = item
      console.log(item)
    },

    closeDialog () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    //async()

    async approve(){
      try {
        memoryService.flagMemory({id: this.item.id, flagged: !this.item.flagged}).then(response => {
          if(response.status == 200) {
            console.log(this.item)
            Vue.delete(this.memories,this.memories.findIndex(e=>e.id == this.item.id))
            this.status = `Item ${this.item.id} was successfully`
            this.status += this.item.flagged ? "re-approved" : "reported and hidden."
            this.closeDialog();
          }
        })
      } catch(err) {
        console.log(err)
      }
    },

    getDate(timestampedString) {
      
      let timestamp = new Date(timestampedString)
      
      let string = timestamp.getFullYear()+"/"+timestamp.getMonth()+"/"+timestamp.getDay()
      return string

    }
  },

  watch: {
    asyncMemories: function(memories) {
      this.memories = memories
    },
  }
}
</script>

<style scoped>

</style>
