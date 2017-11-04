// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//ToDo List
//End game if a player disconnects
//Give up option
//Use a better data format
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io';
import Vuex from 'vuex';


Vue.config.productionTip = false



Vue.use(VueSocketio, 'localhost:4000')
Vue.use(Vuex)

const initialState = {
    time: 10,
    gameMode: 'singleplayer',
    score: 0,
    opScore: 0,
    roundNum: 10,
    opponentDisconnected: false,
    region: '',
    players: 2,
    
  }

const store = new Vuex.Store({
  state: Object.assign({}, initialState),
  mutations: {
    changeTime (state, time) {
      state.time = time;
    },
    setSingleplayer (state) {
      state.gameMode = 'singleplayer'
    },

    setMultiplayer (state) {
      state.gameMode = 'multiplayer'
    },

    saveScores (state, scores) {
      state.score = scores.score;
      state.opScore = scores.opScore;
    },

    changeRounds (state, roundNum) {
      state.roundNum = roundNum;
      
    },

    opponentDisconnected (state){
      state.opponentDisconnected = true;
    },
    resetState (state){
      Object.assign(state, initialState)
      
    }

  }
})

router.replace('/')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
