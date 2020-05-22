<template>
  <div>
    <div v-if="status === 'playing'">
      <div ref="container" :style="style">
        <app-bastard-group :status="status" @statusChanged="status = $event"></app-bastard-group>
        <app-life :life="life" :status="status" @statusChanged="status = $event"></app-life>
        <app-tank :life="life" :status="status" @statusChanged="status = $event"></app-tank>
      </div>
    </div>
    <div v-else-if="status === 'not-started'">
      <h3>Welcome!</h3>
      <button type="button" @click="start()">Start</button>
    </div>
    <div v-else-if="status === 'paused'">
      <h3>Paused!</h3>
    </div>
    <div v-else-if="status === 'gameover'">
      <h3>Game over!</h3>
      <button type="button" @click="status = 'playing'">Restart</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Tank from './components/Tank.vue';
import Life from './components/Life.vue';
import BastardGroup from './components/BastardGroup.vue';
import { eventBus } from './main';


window.GAME_WIDTH = 600;
window.GAME_OFFSET = (window.innerWidth - window.GAME_WIDTH) / 2;

export default {
  data() {
    return {
      status: 'not-started',
      level: 1,
      life: 100
    }
  },
  components: {
    'app-tank': Tank,
    'app-life': Life,
    'app-bastard-group': BastardGroup
  },
  created() {
    let vm = this
    window.addEventListener('keydown', function(event) {
      if (event.code == 'KeyP') {
        if (vm.status === 'paused') {
          vm.status = 'playing'
        } else {
          vm.status = 'paused'
        }
      }
    });
    eventBus.$on('lifeChanged', (new_life) => {
      vm.life = new_life
      if (vm.life <= 0) {
        vm.status = 'gameover'
      }
    });
  },
  methods: {
    start() {
      this.life = 100
      this.status = 'playing'
    }
  },
  computed: {
    style() {
      return {
        width: window.GAME_WIDTH + 'px',
        height: window.innerHeight + 'px',
        margin: '0 auto',
        backgroundColor: 'grey'
      }
    }
  },
  watch: {
    status() {
      this.$emit('statusChanged', this.status)
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
