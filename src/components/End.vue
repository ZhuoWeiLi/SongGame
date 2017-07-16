<template>
    <div class='fullHeight centerContent'>
        <div v-if = 'opponentDisconnected' class='endMessage'>
            <h1>Your Opponent Has Disconnected.</h1>
            <button id='restartButton' class='choice-button' v-on:click='restart'>Back to Menu</button>
        </div>
        <div v-else-if='gameMode === "multiplayer"' class='endMessage'>
            <h1>{{this.message}}</h1>
            <p>
                <span class='score'>{{score}} - {{opScore}}</span>
            </p>
            <button id='restartButton' class='choice-button' v-on:click='restart'>Back to Menu</button>
        </div>
        <div v-else class='endMessage'>
            <h1>You got a score of {{score}} in {{roundNum}} rounds</h1>
            <button id='restartButton' class='choice-button' v-on:click='restart'>Back to Menu</button>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            score: this.$store.state.score,
            opScore: this.$store.state.opScore,
            opponentDisconnected: this.$store.state.opponentDisconnected
        }
    },
    computed: {
        message() {
            if (this.score > this.opScore) {
                return 'Congratulations you won!';
            }
            else if (this.score == this.opScore) {
                return 'A tie!';
            }

            else {
                return 'Better luck next time!';
            }
        },
        gameMode() {
            return this.$store.state.gameMode
        },

        roundNum() {
            return this.$store.state.roundNum
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
.score {
    font-size: 50px;
    letter-spacing: 2px;
}

#restartButton {
    width: 100%;
    color: white;
}

.endMessage {
    border: 1px solid black;
    padding: 8%;
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
</style>