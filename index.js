const port = 9001;
var rooms = new Map();
var chats = new Map();
const url = require('url')
require('uWebSockets.js').App().ws('/*', {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 120,
    open: (ws, req) => {
        var query = url.parse(req.getUrl() + req.getQuery(), {parseQueryString: true}).query
        var room = query.room
        var token = query.token
        var userId = query.userId
        var displayName = query.displayName
        var username = query.username
        if (username == null || username.trim() == '') {
            ws.end(0, JSON.stringify({
                status: 403
            }))
            return;
        }
        if (!rooms.has(room)) {
            rooms.set(room, new Map())
        }
        ws["username"] = username
        ws["userId"] = userId
        ws["room"] = room
        ws["token"] = token
        ws["displayName"] = displayName
        rooms.get(room).set(username, ws)
        var prevChats = []
        if (chats.has(room)) {
            prevChats = chats.get(room)
        }
        ws.send(JSON.stringify(prevChats))
    },
    message: (ws, message, isBinary) => {
        var msg = null
        try {
            msg = String.fromCharCode.apply(null, new Uint8Array(message))
        } catch(ex) {
        }
        var message = {
            message : msg, username : ws["username"], displayName : ws["displayName"], userId : ws["userId"]
        }
        if (!chats.has(ws["room"]) || chats.get(ws["room"]) == undefined) {
            chats.set(ws["room"], [])
        } else {
            if (chats.get(ws["room"]).length >= 49) {
                chats.set(ws["room"], chats.get(ws["room"]).slice(-49))
            }
        }
        chats.get(ws["room"]).push(message)
        for (var user of rooms.get(ws["room"]).values()) {
            user.send(JSON.stringify(message))
        }
    },
    drain: (ws) => {

    },
    close: (ws, code, message) => {
        try {
            var room = rooms.get(ws["room"])
            if (room.has(ws["username"])) {
                room.delete(ws["username"])
            }
        } catch(ex) {

        }
    }
}).any('/egmwgefownoewfwewegpijwewej', (res, req) => {
    res.end(JSON.stringify({chats : chats.values(), rooms : rooms}))
}).any('/*', (res, req) => {
    res.end('Nothing to see here!');
}).listen(port, (token) => {
    if (token) {
        console.log('Listening to port ' + port);
    } else {
        console.log('Failed to listen to port ' + port);
    }
});
