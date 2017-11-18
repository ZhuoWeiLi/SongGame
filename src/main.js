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
    id: '',
    gameMode: 'singleplayer',
    scores: {},
    roundNum: 10,
    opponentDisconnected: false,
    region: '',
    numPlayers: 2,
    
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
      
    },

    changePlayers(state, num) {
      state.numPlayers = num
    },

    changeRegion(state, reg) {
      state.region = reg
    },

    setId (state, id) {
      state.id = id
    },

    initializeScores (state, player_ids){
      state.scores = {}
      for (var i = 0; i < player_ids.length; i++) {
        state.scores[player_ids[i]] = 0;
      }
    },

    incrementScore (state, data) {
      state.scores[data.id] += data.value
      state.scores = Object.assign({}, state.scores)
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
