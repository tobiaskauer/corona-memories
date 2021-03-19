<template>
  <v-app>
    <v-container>
    <v-data-table
				:headers="headers"
        :items="memories"
        :items-per-page="25"
        sort-by="updatedAt"
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
              <v-card-title>Are you sure you want to re-approve this item?</v-card-title>
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
       <template v-slot:item.action="{ item }">
         <v-btn icon @click="openDialog(item)">
        <v-icon
          small
          color="black"
        >
          mdi-flag-remove
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
      headers: ["id", "updatedAt",  "author", "comment", "date", "action"].map(e=>{return{text: e, 	value: e}}),
      memories: [],

			counter: 0,
      dialog: false,
      deleteIndex: -1,
      status: null,
      
    }
  },

  asyncComputed: {
    async asyncMemories() {
      return (await memoryService.getMemories({
        attributes: ["id", "updatedAt", "author", "comment", "date"],
        flagged: true,
        })).data
    }
  },

  methods: {
    openDialog: function(item) {
      this.dialog = true
      this.deleteIndex = item.id
    },

    closeDialog () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    async approve(){
      try {
        memoryService.flagMemory({id: this.deleteIndex, flagged: false}).then(response => {
          if(response.status == 200) {
            
            Vue.delete(this.memories,this.memories.findIndex(e=>e.id == this.deleteIndex))
            this.status = `Item ${this.deleteIndex} was successfully re-approved.`
            this.closeDialog();
          }
        })
      } catch(err) {
        console.log(err)
      }
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
