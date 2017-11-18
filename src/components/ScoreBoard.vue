<template>
    <table id='scoreboard'>
        <tr><th>Players</th><th>Score</th></tr>
        <tr v-bind:data-id='value.id' v-for="(value, index) in scores">
             <td v-if="value.id === id">You</td>
            <td v-else>Player {{index+1}}</td>
            <td>{{value.score}}</td>
        </tr>
    </table>
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
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#scoreboard {
    position: absolute;
    top: 5px;
    left: 5px;
}

td {
    text-align: center
}

table, th, td {
    background: #FAFAFA;
    border: 1px solid black;
    box-sizing: border-box;
    white-space: nowrap;
    border-radius: 2px;
}

table {
    box-shadow: 1px 1px 1px black;
    width: 200px;
}

th {
    background: lightgrey;
}

td {
    height: 20px;
}

#scoreboard tr:first-child {
    height: 30px;
}
</style>