<template>
    <div class='fullHeight centerContent'>
        <div>
            <div class = 'loader'></div>
            <h1>Searching for Opponent...</h1>
        </div>
        
    </div>
</template>

<script>

export default {

    sockets: {
        id(data) {
            this.$store.commit('setId', data.id)
        },


        found(data) {
            this.$store.commit('initializeScores', data.players)
            this.startGame();
        },



    },

    data() {
        return {}
    },

    created() {
        this.$socket.emit('searching', { players: this.$store.state.numPlayers, region: this.$store.state.region });
    },

    methods: {
        startGame() {
            this.$store.commit('changeTime', 30)
            this.$router.push('/game')
        }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.loader {
    border: 16px solid steelblue; /* Light grey */
    border-top: 16px solid #f3f3f3; /* Blue */
    border-radius: 50%;
    margin: 0 auto;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>