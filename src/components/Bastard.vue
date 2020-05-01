<template>
  <div :style="style" v-if="life > 0" id="bast">

  </div>
</template>

<script>
  import { eventBus } from '../main';

  var WIDTH = 50
  var HEIGHT = 50

  export default {
    name: 'bastard',
    data: function() {
      return {
        life: 100,
        left: eventBus.enemyPositionX(WIDTH),
        top: 10,
        width: WIDTH,
        height: HEIGHT
      };
    },
    created() {
      var vm = this;
      eventBus.$on('attack', (damage, fireEl) => {
        if (this.life > 0) {
          var collison = eventBus.doElsCollide(this, fireEl);
          if (collison === true) {
            console.log('hit');
            vm.life -= damage;
            fireEl.hit = 1;
          }
        }
      });
    },
    computed: {
      style: function() {
        var backgroundColor = 'black'
        if (this.life <= 30) {
          backgroundColor = 'red'
        } else if (this.life <= 70) {
          backgroundColor = 'yellow'
        }
        return {
          backgroundColor: backgroundColor,
          left: this.left + 'px',
          top: this.top + 'px',
          height: HEIGHT + 'px',
          width: WIDTH + 'px'
        }
      }
    }
  };
</script>

<style scoped>
  div {
    position: fixed;
  }
</style>
