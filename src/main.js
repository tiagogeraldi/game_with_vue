import Vue from 'vue'
import App from './App.vue'

export const eventBus = new Vue({
  methods: {
    attack(damage, bullet) {
      this.$emit('attack', damage, bullet);
    },
    counterAttack(damage, bullet) {
      this.$emit('counterAttack', damage, bullet);
    },
    doElsCollide(el1, el2) {
      el1.offsetTop = el1.top;
      el1.offsetLeft = el1.left;
      el1.offsetBottom = el1.offsetTop + el1.height;
      el1.offsetRight = el1.offsetLeft + el1.width;

      el2.offsetTop = el2.top + el2.height;
      el2.offsetLeft = el2.left + el2.width;
      el2.offsetBottom = el2.offsetTop + el2.height;
      el2.offsetRight = el2.offsetLeft + el2.width;

      return !((el1.offsetBottom < el2.offsetTop) ||
               (el1.offsetTop > el2.offsetBottom) ||
               (el1.offsetRight < el2.offsetLeft) ||
               (el1.offsetLeft > el2.offsetRight))
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
