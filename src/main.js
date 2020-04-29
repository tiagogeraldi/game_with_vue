import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#game',
  render: h => h(App)
});

window.doElsCollide = function(el1, el2) {
  el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
  el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
  el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
  el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

  return !((el1.offsetBottom < el2.offsetTop) ||
           (el1.offsetTop > el2.offsetBottom) ||
           (el1.offsetRight < el2.offsetLeft) ||
           (el1.offsetLeft > el2.offsetRight))
};
