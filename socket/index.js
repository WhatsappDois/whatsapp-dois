const { Server } = require('socket.io');

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000',
    }, 
});

let users = [];
let rateLimitWindow = 60000; // 1 minute
let maxRequestsPerWindow = 100;
let requestCounts = {}; 

const addUser = (userData, socketId) => {
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}

// Rate limiting middleware
const rateLimiter = (socket, next) => {
    const socketId = socket.id;
    if (!requestCounts[socketId]) {
        requestCounts[socketId] = {
            count: 0,
            timer: setTimeout(() => {
                delete requestCounts[socketId];
            }, rateLimitWindow)
        };
    }

    if (requestCounts[socketId].count >= maxRequestsPerWindow) {
        return next(new Error('Rate limit exceeded'));
    }

    requestCounts[socketId].count++;
    next();
}

io.use(rateLimiter);

io.on('connection', (socket) => {
    console.log('user connected');

    // connect
    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    });

    // send message
    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});

console.log('Server is running on port 9000');
