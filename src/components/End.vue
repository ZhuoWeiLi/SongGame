<template>
    <div class='fullHeight centerContent'>
        <!--         <div v-if = 'opponentDisconnected' class='endMessage'>
                                <h1>An Opponent Has Disconnected.</h1>
                                <button id='restartButton' class='choice-button' v-on:click='restart'>Back to Menu</button>
                            </div> -->
        <div class='endMessage'>
            <h1>Final Standings</h1>
            <table id='scoreboard'>
                <tr v-bind:data-id='value.id' v-for="(value, index) in scores">
                    <td v-if="value.id === id">You</td>
                    <td v-else>Player {{index+1}}</td>
                    <td>{{value.score}}</td>
                </tr>
            </table>

            <button id='restartButton' class='choice-button' v-on:click='restart'>Back to Menu</button>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            id: this.$store.state.id,
        }
    },
    computed: {
        scores() {
            const list = []
            for (let key in this.$store.state.scores) {
                list.push({ id: key, score: this.$store.state.scores[key] })
            }
            list.sort((a, b) => {
                return b.score - a.score;
            })
            return list
        }

    },

    methods: {
        restart() {
            console.log('called resetState')
            this.$store.commit('resetState')
            this.$router.push('/')
        }
    }

}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#restartButton {
    width: 100%;
    color: white;
}

.endMessage {
    border: 1px solid black;
    padding: 5%;
    border-radius: 10%;
    color: white;
    background: #111111;
    box-shadow: 10px 10px 20px black;
    text-align: center;
}

.choice-button {
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
    height: 10%;
    border-radius: 50%;
    margin-bottom: 20%;
    border: 0.5px solid grey;
    background: rgba(225, 217, 199, 0.6);
    cursor: pointer;
}

.choice-button:hover {
    background: #c1b9a7;
}

table {
    width: 100%;
    margin: 15% 0;
    padding: 0;
}

td:first-child {
    text-align: left;
    font-size: 1.5em
}

td:nth-child(2) {
    text-align: right;
    font-size: 1.5em
}

</style>