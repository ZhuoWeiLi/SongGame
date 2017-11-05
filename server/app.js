const express = require('express');
const app = express();
const socket = require('socket.io');
const _ = require('underscore');
const songs = require('./data.js')
const request = require('request')


app.use(express.static('public'))

const server = app.listen(process.env.PORT || 4000);
const io = socket(server);

const gameRooms = {}

const TOP_SONGS_URL_BASE = "https://rss.itunes.apple.com/api/v1/"
const TOP_SONGS_URL_END = "/itunes-music/hot-tracks/all/100/explicit.json"

function getTopSongs(region) {
    return new Promise((resolve, reject) => {
        request(TOP_SONGS_URL_BASE + region + TOP_SONGS_URL_END, (error, success, data) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(JSON.parse(data).feed.results)
            }

        })
    })
}

getTopSongs('us')

io.on('connection', (socket) => {
    socket.on('searching', (data) => {
        socket.join(data.region + data.players);
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
            io.sockets.in(socket.gameRoom).emit('found', {});


        }
    })
    socket.on('ready', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        console.log(Object.keys(room.sockets).length)
        if (room.count === Object.keys(room.sockets).length) {
            room.count = 0;
            io.sockets.in(socket.gameRoom).emit('startGame')
        }

        console.log(room)


    })

    socket.on('notReady', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count -= 1;
    })

    socket.on('getSongs', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;

        if (room.count === Object.keys(room.sockets).length) {
            choices = _.sample(songs, 4);
            song = _.sample(choices);
            io.sockets.in(socket.gameRoom).emit('newRoundSongs', { choices: choices, song: song })
            room.count = 0;
        }

    })

    socket.on('soundLoaded', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        if (room.count === Object.keys(room.sockets).length) {
            console.log('second loaded at ' + Date.now())
            room.count = 0;
            io.sockets.in(socket.gameRoom).emit('startSong', { startTime: Date.now() + 2000 })
        }


    })

    socket.on('buttonClicked', (data) => {
        socket.in(socket.gameRoom).emit('opponentClicked', data)
    })

    socket.on('skip', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count += 1;
        if (room.count === Object.keys(room.sockets).length) {
            room.count = 0;
            console.log('skipping')
            io.sockets.in(socket.gameRoom).emit('skip')
        }

    })

    socket.on('unSkip', () => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        room.count -= 1;
    })
    console.log('socket received', socket.id);

    socket.on('disconnecting', (reason) => {
        const room = io.sockets.adapter.rooms[socket.gameRoom]
        io.sockets.in(socket.gameRoom).emit('opponentDisconnected')
    })
})