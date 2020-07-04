import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    life: 100,
    status: 'not-started',
    level: 1,
    points: 0
  },
  getters: {
    life: state => {
      return state.life
    },
    status: state => {
      return state.status
    },
    level: state => {
      return state.level
    },
    points: state => {
      return state.points
    },
    isPlaying: state => {
      return state.status === 'playing'
    }
  },
  mutations: {
    gameover: state => {
      state.status = 'gameover'
      state.life = 100
    },
    playing: state => {
      state.status = 'playing'
    },
    paused: state => {
      state.status = 'paused'
    },
    damage(state, amount) {
      state.life -= amount
      if (state.life <= 0) {
        this.commit('gameover')
      }
    }
  }
});
