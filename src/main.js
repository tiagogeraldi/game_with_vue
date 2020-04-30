import Vue from 'vue'
import App from './App.vue'

export const eventBus = new Vue({
  methods: {
    attack(damage, bullet) {
      this.$emit('attack', damage, bullet);
    },
    doElsCollide(target, bullet) {
      var bulletOffsetTop = window.innerHeight - bullet.bottom + bullet.height;
      var bulletOffsetLeft = window.innerWidth - bullet.right + bullet.width;

      var targetOffsetBottom = window.innerHeight - target.top + target.height;
      var targetOffsetLeft = window.innerWidth - target.right - target.width;

      return !((targetOffsetBottom < bulletOffsetTop) ||
               (target.top > bullet.bottom) ||
               (target.right < bulletOffsetLeft) ||
               (targetOffsetLeft > bullet.right))

      // return !((el1.offsetBottom < el2.offsetTop) ||
      //      (el1.offsetTop > el2.offsetBottom) ||
      //      (el1.offsetRight < el2.offsetLeft) ||
      //      (el1.offsetLeft > el2.offsetRight))
    },
    enemyPositionX(enemyWidth) {
      return Math.floor(Math.random() * (window.innerWidth - enemyWidth - 1) ) + 1;
    }
  }
});

new Vue({
  el: '#game',
  render: h => h(App)
});
