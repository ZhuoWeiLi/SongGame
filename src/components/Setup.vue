<template>
    <div class='fullHeight centerContent'>
        <div id='timeLimit'>
            <p>Input the number of seconds you would like to have for each guess.</p>
            <input type='text' v-model='time' value='10'></input>
            <p>Input the number of rounds you would like to play</p>
            <input type='text' v-model='roundNum' value='10'></input>
            <router-link to='/game'>
                <button v-on:click='startSingleGame' id='start-button'>Start</button>
            </router-link>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            time: this.$store.state.time,
            roundNum: this.$store.state.roundNum
        }
    },
    methods: {
        startSingleGame() {
            this.$store.commit('changeTime', this.time)
            this.$store.commit('changeRounds', this.roundNum)

        }
    },



}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#timeLimit {
    color: white;
    width: 10%;
    padding: 5px;
    border-radius: 10%;
    text-align: center;
    background: #663300;
}

#timeLimit input {

    width: 100%;
    box-sizing: border-box;
    border-radius: 10%;
    text-align: center;
}

#start-button {
    font-family: inherit;
    border-radius: 10%;
    background: #e1d9c7;
    margin: 10px auto;
    height: 30px;
    display: block;
    width: 60%;
    border: 2px solid #663300;
    cursor: pointer;
}

#start-button:active,
#start-button:hover,
.choice-button:hover {
    background: #c1b9a7;
}

</style>
