<template>
  <div id="app" ref="container" :style="style">
    <app-tank></app-tank>
  </div>
</template>

<script>
import Vue from 'vue'
import Tank from './components/Tank.vue';
import Bastard from './components/Bastard.vue';
import { eventBus } from './main';


window.GAME_WIDTH = 600;
window.GAME_OFFSET = (window.innerWidth - window.GAME_WIDTH) / 2;

export const CONF = Object.freeze({
  MAX_BASTARDS: 7,
  BASTARDS_INTERVAL: 6000
})

export default {
  data() {
    return {
      gameover: false,
      level: 1,
      bastards: []
    }
  },
  components: {
    'app-tank': Tank,
    'app-bastard': Bastard
  },
  created() {
    this.addBastard()
  },
  methods: {
    addBastard() {
      if (this.$refs.container) {
        // Do not allow a new bastard overlay
        // any existing bastard
        var instance = null
        var collide = false
        do {
          var ComponentClass = Vue.extend(Bastard)
          var left = eventBus.enemyPositionX(50) // random position
          instance = new ComponentClass({
            propsData: { left: left }
          });
          instance.$mount()
          collide = false
          this.bastards.forEach(function(bastard) {
            if (eventBus.doElsCollide(bastard, instance)) {
              collide = true
            }
          })
        } while (collide)
        this.$refs.container.appendChild(instance.$el)
        this.bastards.push(instance)
      }
      if (this.bastards.length < CONF.MAX_BASTARDS) {
        setTimeout(this.addBastard, CONF.BASTARDS_INTERVAL)
      }
    }
  },
  computed: {
    style() {
      return {
        width: window.GAME_WIDTH + 'px'
      }
    }
  }
};
</script>


<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#app {
  height: 100%;
  margin: 0 auto;
  background-color: grey;
}
</style>
