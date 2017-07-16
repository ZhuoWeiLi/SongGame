<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>



<script>

import Setup from './components/Setup.vue';


export default {
  name: 'app',


}
</script>

<style>
body,
html {
  height: 100%;
  font-family: 'Risque';
  overflow: hidden;
}

body {
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  background: white;
}

#app {
  border: 1px solid black;
  background: #A1FFCE;
  background: -webkit-linear-gradient(left, #FAFFD1, #A1FFCE);
  background: -moz-linear-gradient(left, #FAFFD1, #A1FFCE);
  background: -o-linear-gradient(left, #FAFFD1, #A1FFCE);
  background: linear-gradient(to right, #FAFFD1, #A1FFCE);
  height: 100%;
}

button:focus {
  outline: 0;
}

.centerContent {
    display: flex;
    align-items: center;
    justify-content: center;
}

.fullHeight {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
