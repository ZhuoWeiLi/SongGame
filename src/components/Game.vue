<template>
    <div class='fullHeight' id='Game'>
        <h2 id='you'>Your score:
            <span>{{score}}</span>
        </h2>
        <div v-if='ready||gameMode==="singleplayer"' id='choices'>
            <button v-bind:data-title='choice.title' v-for='choice in choices' class='choice-button' v-on:click='checkAnswer'>
                <span class='source'>{{choice.source}}</span>
                <span> - </span>
                <span class='title'>{{choice.title}}</span>
            </button>
            <button v-if = '!skip' id = 'notSkipping' v-on:click='skipRound'>Skip</button>
            <button v-else id = 'Skipping' v-on:click='skipRound'>Skipping</button>
        </div>
    
        <button id='readyButton' v-bind:class='{ready: clicked}' v-on:click='getReady' v-else>{{buttonMessage}}</button>
        <div id='opponent'>
            <h2 v-if='gameMode == "multiplayer"'>Opponent's score:
                <span>{{opScore}}</span>
            </h2>
        </div>
    </div>
</template>

<script>
import songs from '../../server/data.js'
import _ from 'underscore';
import howl from 'Howler'


var DEBUG = true;



export default {


    data() {
        return {
            time: this.$store.state.time,
            gameMode: this.$store.state.gameMode,
            roundNum: this.$store.state.roundNum,
            score: 0,
            opScore: 0,
            roundOver: true,
            roundCount: 0,
            timeOutFunc: '',
            choices: [],
            audio: '',
            song: "",
            ready: false,
            clicked: false,
            skip: false,
            buttonMessage: 'Not Ready',
            skipMessage: 'Skip'

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

        skipRound() {
            if (!this.roundOver) {
                if (this.gameMode === 'singleplayer') {
                    this.endRound();
                }
                else if (!this.skip) {
                    this.$socket.emit('skip')
                    this.skip = true;
                    this.skipMessage = 'Skipping'
                }
                else {
                    this.$socket.emit('unSkip')
                    this.skip = false;
                    this.skipMessage = 'Skip'
                }
            }



        },

        resetButtons: function () {
            var buttons = document.querySelectorAll('#choices > .choice-button')
            buttons.forEach(function (el) {
                el.className = 'choice-button';
            })
        },

        newRound: function () {
            this.resetButtons();
            if (this.gameMode === 'multiplayer') {
                this.$socket.emit('getSongs', {})
            }
            else {
                this.choices = _.sample(songs, 4);
                this.song = _.sample(this.choices)
                this.loadSong();
            }

        },


        loadSong() {
            this.audio = new Howl(
                {
                    src: require("../assets/songs/" + this.song.title + ".mp3"),
                    onload: function () {
                        console.log('songloaded')
                        if (this.gameMode === 'multiplayer') {
                            this.$socket.emit('soundLoaded')
                        }
                        else {
                            this.startSong();
                        }

                    }.bind(this)

                })

        },

        startSong() {
            setTimeout(function () {
                this.roundOver = false;
                
                this.audio.play();
                if (DEBUG) console.log('started playing at', new Date().getSeconds())
                this.timeOutFunc = setTimeout(this.endRound.bind(this), this.time * 1000)
            }.bind(this), 2000)
        },

        checkAnswer: function (event) {

            if (!this.roundOver) {
                var element = event.currentTarget
                var clickedSong = element.getAttribute('data-title');
                var scoreChange;

                if (clickedSong === this.song.title) {
                    scoreChange = 1
                    element.className += ' success';
                }
                else {
                    scoreChange = -1
                    element.className += ' failure';

                }

                this.score += scoreChange;

                if (this.gameMode === 'multiplayer') {
                    this.$socket.emit('buttonClicked', { clickedSong: clickedSong, scoreChange: scoreChange })

                }
                this.endRound();

            }


        },

        colorButtons: function () {
            var correctAnswer = this.song.title
            var buttons = document.querySelectorAll('#choices > .choice-button');
            buttons.forEach(function (el) {
                if (el.getAttribute('data-title') === correctAnswer) {

                    el.className += ' success'
                }
                else {
                    el.className += ' done'
                }

            })
        },

        endRound: function () {
            if (!this.roundOver) {
                this.skip = false;
                clearTimeout(this.timeOutFunc);
                if (DEBUG) console.log('over at', new Date().getSeconds())

                this.colorButtons();
                this.roundOver = true;
                this.audio.pause();
                this.roundCount += 1;


                setTimeout(function () {
                    if (this.roundCount >= this.roundNum) {
                        this.resetButtons();
                        this.endGame();
                    }
                    else {
                        this.newRound();
                    }
                }.bind(this), 2000)


            }
        },

        endGame: function () {
            this.$store.commit('saveScores', { score: this.score, opScore: this.opScore })
            this.$router.push('/end')
            

        },


    },

    sockets: {
        newRoundSongs(data) {
            console.log('received Songs')
            if (DEBUG) console.log('received song at', new Date().getSeconds())

            this.choices = data.choices;
            this.song = data.song;

            if (DEBUG) console.log(this.audio);
            this.loadSong();
        },

        opponentClicked(data) {
            this.opScore += data.scoreChange;
            var clickedButton = document.querySelector('button[data-title="' + data.clickedSong + '"]')
            var correctButton = document.querySelector('button[data-title="' + this.song.title + '"]')
            console.log(clickedButton);

            if (data.clickedSong === this.song.title) {
                clickedButton.className += ' opSuccess';
            }
            else {
                clickedButton.className += ' opFailure';
                correctButton.className += ' success'
            }

            this.endRound();

        },

        startGame() {
            this.ready = true;
            this.newRound();
        },

        startSong() {
            this.startSong();
        },

        skip () {
            this.endRound();
        },

        opponentDisconnected() {
            console.log('opponent disconnected')
            this.endRound();
            this.$store.commit('opponentDisconnected')
            this.audio = '';
            this.$router.push('/end')

        }

    },
    created() {
        if (this.gameMode === 'singleplayer') this.newRound();

    }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Game {
    display: flex;
    align-items: center;
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

#notSkipping, #Skipping {
    width: 50%;
    height: 30px;
    border-radius: 10%;
    margin: 0 auto;
}

#notSkipping {
    background: lightblue;
    cursor: pointer;
}

#Skipping, #notSkipping:hover {
    background: lightyellow;
    transition: 0.5s;
}



#you {
    margin-left: 5%;
    width: 15%;
    text-align: left;
}

#opponent {
    margin-right: 5%;
    width: 15%;
    text-align: right;
}

#choices {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 25% 20% 25% 20%;
    height: 60%;
    width: 20%;
    background: rgba(238, 238, 255, 0.3)
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

.choice-button:last-of-type {
    margin-bottom: 0;
}

.done {
    cursor: none;
    background: grey;
}

.success,
.failure,
.opSuccess,
.opFailure {
    transition: 1s;
}

.choice-button:hover {
    background: #c1b9a7;
}

.choice-button.success {
    background: green;
}




.choice-button.failure {
    background: red;
}

.choice-button.opSuccess {
    background: cyan;
}

.choice-button.opFailure {
    background: orange;
}
</style>