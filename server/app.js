const express = require('express');
const app = express();
const socket = require('socket.io');
const _ = require('underscore');
const songs = require('./data.js')


app.use(express.static('public'))

const server = app.listen(process.env.PORT || 4000);
const io = socket(server);

const readyCount = {};
const emitCount = {};
const skipCount = {};


io.on('connection', (socket) => {
    socket.on('searching', () => {
        socket.join('waiting');
        waitingSockets = Object.keys(io.sockets.adapter.rooms["waiting"].sockets)
        if (waitingSockets.length >= 2) {
            console.log('starting game')
            const players = waitingSockets.slice(0, 2);

            players.forEach((value, index) => {
                currentSocket = io.sockets.sockets[value];
                currentSocket.leave('waiting');
                currentSocket.join(players[0]);
                currentSocket.gameRoom = players[0];
            })
            io.sockets.in(socket.gameRoom).emit('found', {});


        }
    })
    socket.on('ready', () => {
        const room = socket.gameRoom
        if (!readyCount[room]) {
            readyCount[room] = 1;
        }
        else {
            readyCount[room] = 0;
            io.sockets.in(room).emit('startGame')
        }


    })

    socket.on('notReady', () => {
        const room = socket.gameRoom
        readyCount[room] -= 1;
    })

    socket.on('getSongs', () => {
        choices = _.sample(songs, 4);
        song = _.sample(choices);
        const room = socket.gameRoom
        if (!emitCount[room]) {
            emitCount[room] = 1;
            io.sockets.in(room).emit('newRoundSongs', { choices: choices, song: song })
        }
        else {
            emitCount[room] = 0;
        }

    })

    socket.on('soundLoaded', () => {
        const room = socket.gameRoom
        skipCount[room] = 0;
        if (!readyCount[room]) {
            readyCount[room] = 1;
        }
        else {
            readyCount[room] = 0;
            io.sockets.in(room).emit('startSong')
        }


    })

    socket.on('buttonClicked', (data) => {
        socket.in(socket.gameRoom).emit('opponentClicked', data)
    })

    socket.on('skip', () => {
        const room = socket.gameRoom
        if (!skipCount[room]) {
            skipCount[room] = 1;
        }
        else {
            skipCount[room] = 0;
            console.log('skipping')
            io.sockets.in(room).emit('skip')
        }
    })

    socket.on('unSkip', ()=> {
        const room = socket.gameRoom
        skipCount[room] -= 1;
    })
    console.log('socket received', socket.id);

    socket.on('disconnecting', (reason) => {
        const room = socket.gameRoom;
        io.sockets.in(room).emit('opponentDisconnected')
    })
})