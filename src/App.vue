<template>
  <div>
    <div v-if="status === 'playing'">
      <div ref="container" :style="style">
        <app-life></app-life>
        <app-tank></app-tank>
      </div>
    </div>
    <div v-else-if="status === 'not-started'">
      <h3>Welcome!</h3>
      <button type="button" @click="playing()">Start</button>
    </div>
    <div v-else-if="status === 'paused'">
      <h3>Paused!</h3>
    </div>
    <div v-else-if="status === 'gameover'">
      <h3>Game over!</h3>
      <button type="button" @click="playing()">Restart</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Tank from './components/Tank.vue';
import Life from './components/Life.vue';
import Bastard from './components/Bastard.vue';
import { eventBus } from './main';
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';


window.GAME_WIDTH = 600;
window.GAME_OFFSET = (window.innerWidth - window.GAME_WIDTH) / 2;

export const CONF = Object.freeze({
  MAX_BASTARDS: 7,
  BASTARDS_INTERVAL: 6000
})

export default {
  components: {
    'app-tank': Tank,
    'app-life': Life,
    'app-bastard': Bastard
  },
  created() {
    window.addEventListener('keydown', (event) => {
      if (event.code == 'KeyP') {
        if (this.status === 'paused') {
          this.playing()
        } else {
          this.paused()
        }
      }
    });
    this.addBastard()
  },
  methods: {
    ...mapMutations([
      'gameover', 'playing', 'paused', 'damage', 'pushBastard'
    ]),
    addBastard() {
      if (this.$refs.container && this.isPlaying) {
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
          this.bastards.forEach(bastard => {
            if (eventBus.doElsCollide(bastard, instance)) {
              collide = true
            }
          })
        } while (collide)
        this.$refs.container.appendChild(instance.$el)
        this.pushBastard(instance)
      }
      if (this.bastards.length < CONF.MAX_BASTARDS) {
        setTimeout(this.addBastard, CONF.BASTARDS_INTERVAL)
      }
    }
  },
  computed: {
    ...mapGetters([
      'life', 'status', 'isPlaying', 'bastards'
    ]),
    style() {
      return {
        width: window.GAME_WIDTH + 'px',
        height: window.innerHeight + 'px',
        margin: '0 auto',
        backgroundColor: 'grey'
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
</style>
