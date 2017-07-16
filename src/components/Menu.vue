<template>
  <div class='fullHeight' id='start-menu'>
  
    <div id='start-buttons'>
      <h1 class='text-center'>Song Guessing Game</h1>
      <router-link  to='/lobby'><button class='brown-button'>Find Opponent</button></router-link>
      <router-link to='/setup'><button class='brown-button' >Single-Player</button></router-link>
    </div>
  </div>
</template>

<script>
import howl from 'Howler'


export default {
  data() {
    return {
    }


  },


}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#start-buttons {
    width: 15%;
}

#start-buttons button:active {
    background: #c1b9a7;
}

.text-center {
    text-align: center;
}

#start-menu{
    display: flex;
    align-items: center;
    justify-content: center;

}

.brown-button {
  transition: transform 0.5s;
  font-family: inherit;
  border-radius: 10%;
  box-shadow: 5px 5px 5px #888888;
  background: #e1d9c7;
  margin: 50px auto;
  height: 30px;
  display: block;
  width: 100%;
  border: 2px solid #663300;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: black;
}

.brown-button:hover {
  transform: translate(-5px, -5px)
}
</style>
