<template>
  <div>
    <div v-for="bastard in bastards">
      <app-bastard :status="status" :bastards="bastards" :id="bastard.id"
        @addBastard="handleBastards($event)"
        @statusChanged="status = $event">
      </app-bastard>
    </div>
  </div>
</template>

<script>
  import Bastard from './Bastard.vue';
  import { eventBus } from '../main';
  
  export const CONF = Object.freeze({
    MAX_BASTARDS: 7,
    BASTARDS_INTERVAL: 6000
  })

  export default {
    props: ['status'],
    data: function() {
      return {
        bastards: []
      };
    },
    components: {
      'app-bastard': Bastard
    },
    created() {
      this.createBastard()
    },
    methods: {
      createBastard() {
        this.bastards.push({ id: this.bastards.length + 1 })
        if (this.bastards.length < CONF.MAX_BASTARDS && this.status === 'playing') {
          setTimeout(this.createBastard, CONF.BASTARDS_INTERVAL)
        }
      },
      handleBastards(newBastard) {
        console.log('handling')
        this.bastards.forEach((b) => {
          if (b.id === newBastard.id) {
            b.obj = newBastard
          }
        })
        return this.bastards
      }
    }
  };
</script>

<style scoped>
</style>
