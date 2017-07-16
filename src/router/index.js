import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import Setup from '../components/Setup'
import Game from '../components/Game'
import End from '../components/End'
import Waiting from '../components/Waiting'


Vue.use(Router)



export default new Router({
  routes: [
    {
      path: '/',
      component: Menu,
    },

    {
      path: '/setup',
      component: Setup,
      abstract: true
    },

    {
      path: '/game',
      component: Game
    },

    {
      path: '/end',
      component: End
    },

    {
      path: '/lobby',
      component: Waiting
    }



  ],
  mode: 'abstract'
})
