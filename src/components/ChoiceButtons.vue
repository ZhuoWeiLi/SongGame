<template>
    <div id='choices'>
        <button v-bind:data-title='choice.title' v-for='choice in choices' class='choice-button' v-on:click='checkAnswer'>
            <span class='title'>{{choice.title}}</span>
        </button>
        <button v-if='!skip' id='notSkipping' v-on:click='skipRound'>Skip</button>
        <button v-else id='Skipping' v-on:click='skipRound'>Skipping</button>

    </div>
</template>

<script>
import songs from '../../server/data.js'
import ChoiceButtons from './ChoiceButtons'
import _ from 'underscore';
import howl from 'Howler'

const DEBUG = true;

export default {

    data() {
        return {
            time: this.$store.state.time,
            roundNum: this.$store.state.roundNum,
            numPlayers: this.$store.state.numPlayers,
            roundOver: true,
            roundCount: 0,
            timeOutFunc: '',
            choices: [],
            audio: '',
            song: "",
            clicked: false,
            skip: false,
            skipMessage: 'Skip',
            id: this.$store.state.id

        }
    },

    methods: {
        skipRound() {
            if (!this.roundOver) {
                if (this.numPlayers === 1) {
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
        resetButtons: function() {
            var buttons = document.querySelectorAll('#choices > .choice-button')
            buttons.forEach(function(el) {
                el.className = 'choice-button';
            })
        },

        newRound: function() {
            this.resetButtons();
            this.$socket.emit('getSongs', {})


        },


        loadSong() {
            this.audio = new Howl(
                {
                    src: this.song.source,
                    onload: function() {
                        console.log('songloaded at' + new Date().getSeconds())
                        this.$socket.emit('soundLoaded')

                    }.bind(this)

                })

        },

        startSong() {

            console.log('starting song ' + Date.now())
            this.roundOver = false;
            this.audio.play();
            console.log('started song ' + Date.now())
            this.timeOutFunc = setTimeout(this.endRound.bind(this), this.time * 1000)




        },

        checkAnswer: function(event) {

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



                this.$store.commit('incrementScore', { id: this.id, value: scoreChange })
                console.log(this.$store.state.scores)
                this.$socket.emit('buttonClicked', { id: this.id, clickedSong: clickedSong, scoreChange: scoreChange })

                this.endRound();

            }


        },

        colorButtons: function() {
            var correctAnswer = this.song.title
            var buttons = document.querySelectorAll('#choices > .choice-button');
            buttons.forEach(function(el) {
                if (el.getAttribute('data-title') === correctAnswer) {

                    el.className += ' success'
                }
                else {
                    el.className += ' done'
                }

            })
        },

        endRound: function() {
            if (!this.roundOver) {
                this.skip = false;
                clearTimeout(this.timeOutFunc);
                if (DEBUG) console.log('over at', new Date().getSeconds())

                this.colorButtons();
                this.roundOver = true;
                this.audio.pause();
                this.roundCount += 1;


                setTimeout(function() {
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

        endGame: function() {
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
            console.log(data)
            this.loadSong();
        },

        opponentClicked(data) {
            this.$store.commit('incrementScore', { id: data.id, value: data.scoreChange })
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

        startSong(data) {
            console.log(data)
            this.startSong();

        },

        skip() {
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
        this.newRound();
    }

}
</script>
<style scoped>
#notSkipping,
#Skipping {
    width: 50%;
    height: 30px;
    border-radius: 10%;
    margin: 0 auto;
}

#notSkipping {
    background: lightblue;
    cursor: pointer;
}

#Skipping,
#notSkipping:hover {
    background: lightyellow;
    transition: 0.5s;
}


#choices {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

      
