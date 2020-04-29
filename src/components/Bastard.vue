<template>
  <div :style="damage" ref="bastard_el">
    
  </div>
</template>

<script>
  export default {
    name: 'bastard',
    data: function() {
      return {
        life: 100
      };
    },
    mounted: function() {
      var vm = this;
      this.$root.$on('attack', function(damage, fireEl) {
        console.log(fireEl);
        var collison = doElsCollide(vm.$refs.bastard_el, fireEl);
        if (collison === true) {
          vm.life -= damage;
          fireEl.hit = 1;
        }
      });
    },
    computed: {
      damage: function() {
        if (this.life <= 70) {
          return { backgroundColor: 'yellow' }
        } else {
          return { backgroundColor: 'black' }
        }
      }
    }
  };
</script>

<style scoped>
  div {
    width: 50px;
    height: 50px;
    position: fixed;
    top: 10px;
  }
</style>
