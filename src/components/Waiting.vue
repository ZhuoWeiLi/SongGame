<template>
    <div class='fullHeight'>
        <h1>Searching for Opponent...</h1>
    </div>
</template>

<script>

export default {

    sockets: {
        found () {
            this.startMultiGame();
        }

    },

    data() {
        return {}
    },

    created() {
        this.$socket.emit('searching', {});
    },

    methods: {
        startMultiGame() {
            this.$store.commit('changeTime', 30)
            this.$store.commit('setMultiplayer')
            this.$router.push('/game')
        }
    }


}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>