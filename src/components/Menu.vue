<template>
  <div class='fullHeight' id='start-menu'>

    <div class='top-left'>
      <p class='inline'>
        Players
        <br>
        <select ref='players' v-on:change='changePlayers'>
          <option value="1">1</option>
          <option selected value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </p>

      <p class='inline'>
        Region
        <br>
        <select ref='region' v-on:change='changeRegion'>
          <option value="Canada">Canada</option>
          <option value="Japan">Japan</option>
          <option value="United States">United States</option>
        </select>
      </p>

    </div>

    <div id='start-buttons'>
      <h1 class='text-center'>Song Guessing Game</h1>
      <router-link to='/lobby'>
        <button class='brown-button'>Play Match</button>
      </router-link>
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

  methods: {
    changePlayers() {
      console.log(this.$refs.players)
      this.$store.commit("changePlayers", this.$refs.players.value)
    },

    changeRegion() {
      this.$store.commit("changeRegion", this.$refs.region.value)
    }
  },

  mounted() {
    this.changePlayers()
    this.changeRegion()

  }


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

#start-menu {
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

.top-left {
  position: absolute;
  left: 20px;
  top: 20px;
}

.inline {
  display: inline-block;
  text-align: center;
}

select {
  background: #FFFFFF;
  margin: 10px;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0 7px;
  border-radius: 3px;
  text-align: center;
  text-align-last: center;
  border: none;
  box-sizing: border-box;
}

option {
  text-align: left;
}
</style>
