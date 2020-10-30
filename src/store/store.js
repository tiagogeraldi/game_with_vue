import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    life: 100,
    status: 'not-started',
    level: 1,
    points: 0,
    bastards: [],
    timeoutFunctions: []
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
    },
    bastards: state => {
      return state.bastards
    }
  },
  mutations: {
    gameover: state => {
      state.status = 'gameover'
      state.life = 100
      state.bastards = []
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
        this.commit('clearTimeouts')
      }
    },
    pushBastard(state, bastard) {
      state.bastards.push(bastard)
    },
    clearTimeouts: state => {
      state.timeoutFunctions.forEach(id => {
        while(id--) {
          window.clearTimeout(id)
        }
      })
      state.timeoutFunctions = []
    },
    pushTimeout(state, func) {
      state.timeoutFunctions.push(func)
    }
  }
});
