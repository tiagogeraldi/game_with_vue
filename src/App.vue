<template>
  <div id="app" ref="container">
    <app-tank></app-tank>
    <app-bastard></app-bastard>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Tank from './components/Tank.vue';
  import Bastard from './components/Bastard.vue';
  import { eventBus } from './main';

  export default {
    data() {
      return {
        gameover: false,
        level: 1
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
        var ComponentClass = Vue.extend(Bastard)
        var instance = new ComponentClass({
          propsData: {
            left: eventBus.enemyPositionX(50)
          }
        });
        instance.$mount()
        if (this.$refs.container) {
          this.$refs.container.appendChild(instance.$el)
        }
        
        setTimeout(this.addBastard, 500)
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
    width: 100%;
    height: 100%;
    background-color: grey;
    border: 5px solid black;
  }
</style>
