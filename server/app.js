const express = require('express');
const app = express();
const socket = require('socket.io');
const _ = require('underscore');
const populateSongs = require('./itunes.js')

let songsByCountry= populateSongs();

setInterval(()=> {
    songsByCountry = populateSongs()
}, 3600000)
 

app.use(express.static('public'))

const server = app.listen(process.env.PORT || 4000);
const io = socket(server);

const countryToCode = {
    'Canada': 'ca',
    'China': 'cn',
    'Japan': 'jp',
    'United States': 'us',
}


io.on('connection', (socket) => {
    socket.on('searching', (data) => {
        socket.join(data.region + data.players);
        socket.emit('id', {id: socket.id})
        socket.region = countryToCode[data.region]
        waitingSockets = Object.keys(io.sockets.adapter.rooms[data.region + data.players].sockets)
        if (waitingSockets.length >= data.players) {
            const players = waitingSockets.slice(0, data.players);

            players.forEach((value, index) => {
                currentSocket = io.sockets.sockets[value];
                currentSocket.leave(data.region + data.players);
                currentSocket.join(players[0]);
                currentSocket.gameRoom = players[0];
                
            })
            io.sockets.adapter.rooms[socket.gameRoom].count = 0
            
            
            io.sockets.in(socket.gameRoom).emit('found', {players: players});
            


        }
    })
    socket.on('ready', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        if (room.count === room.length) {
            room.count = 0;
            io.sockets.in(socket.gameRoom).emit('startGame')
        }



    })

    socket.on('notReady', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count -= 1;
    })

    socket.on('getSongs', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;

        if (room.count === room.length) {
            room.count = 0;
            songsByCountry.then((songs)=> {
                const choices = _.sample(songs[socket.region], 4)
                const song = _.sample(choices);
                io.sockets.in(socket.gameRoom).emit('newRoundSongs', { choices: choices, song: song })
            })
            

        }

    })

    socket.on('soundLoaded', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        if (room.count === room.length) {
            console.log('second loaded at ' + Date.now())
            room.count = 0;
            io.sockets.in(socket.gameRoom).emit('startSong')
        }


    })

    socket.on('buttonClicked', (data) => {
        socket.in(socket.gameRoom).emit('opponentClicked', data)
    })

    socket.on('skip', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        if (room.count === room.length) {
            room.count = 0;
            io.sockets.in(socket.gameRoom).emit('skip')
        }

    })

    socket.on('unSkip', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count -= 1;
    })

/*     socket.on('disconnecting', (reason) => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        io.sockets.in(socket.gameRoom).emit('opponentDisconnected')
    }) */
})