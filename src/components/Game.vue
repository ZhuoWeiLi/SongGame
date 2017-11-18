<template>
    <div class='fullHeight' id='Game'>
        <score-board></score-board>

        <choice-buttons v-if='ready'>
        </choice-buttons>

        <button id='readyButton' v-bind:class='{ready: clicked}' v-on:click='getReady' v-else>{{buttonMessage}}</button>
    </div>
</template>

<script>
import ChoiceButtons from './ChoiceButtons'
import ScoreBoard from './ScoreBoard'


export default {
    components: {
        'choice-buttons': ChoiceButtons,
        'score-board': ScoreBoard
    },


    data() {
        return {
            ready: false,
            clicked: false,
            buttonMessage: 'Not Ready',

        }


    },


    methods: {
        getReady() {
            if (!this.clicked) {
                this.$socket.emit('ready', {})
                this.buttonMessage = 'Ready';
                this.clicked = true;

            }
            else {
                this.$socket.emit('notReady', {})
                this.buttonMessage = 'Not Ready';
                this.clicked = false;
            }

        },

    },

    sockets: {
        startGame() {
            this.ready = true;
        },


    }


}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Game {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

#readyButton {
    margin: 25% 20% 25% 20%;
    width: 20%;
    height: 5%;
    border: 5px solid darkRed;
    box-shadow: 2px 2px 5px black;
    transition: background 0.5s, border 0.5s;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    padding: 0;
}

#readyButton.ready,
#readyButton:hover {
    background: lightgreen;
    transition: background 0.5s, border 0.5s;
    border-color: rgba(0, 0, 0, 0)
}


#readyButton:hover {
    font-size: 0;
}

#readyButton:hover:after {
    content: 'Ready';
    font-size: 14px;
}

</style>