import Vue from 'vue'
import App from './App.vue'

export const eventBus = new Vue({
  methods: {
    attack(damage, bullet) {
      this.$emit('attack', damage, bullet);
    },
    doElsCollide(target, bullet) {
      target.offsetTop = target.top;
      target.offsetLeft = target.left;
      target.offsetBottom = target.offsetTop + target.height;
      target.offsetRight = target.offsetLeft + target.width;

      bullet.offsetTop = bullet.top + bullet.height;
      bullet.offsetLeft = bullet.left + bullet.width;
      bullet.offsetBottom = bullet.offsetTop + bullet.height;
      bullet.offsetRight = bullet.offsetLeft + bullet.width;
      
      return !((target.offsetBottom < bullet.offsetTop) ||
               (target.offsetTop > bullet.offsetBottom) ||
               (target.offsetRight < bullet.offsetLeft) ||
               (target.offsetLeft > bullet.offsetRight))
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
