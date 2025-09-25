"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.getIO = exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
let ioInstance;
const initSockets = (server) => {
    ioInstance = new socket_io_1.Server(server, {
        cors: { origin: config_1.default.frontendUrl || '*' }
    });
    ioInstance.on('connection', (socket) => {
        var _a;
        // optional auth: clients can send token for room joining
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
        if (token) {
            try {
                const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
                const userId = payload.id;
                socket.join(`user:${userId}`); // each user gets a room
            }
            catch (err) {
                // ignore
            }
        }
        socket.on('joinTeam', (teamId) => {
            socket.join(`team:${teamId}`);
        });
        socket.on('disconnect', () => { });
    });
    return ioInstance;
};
exports.initSockets = initSockets;
const getIO = () => {
    if (!ioInstance)
        throw new Error('Socket.io not initialized');
    return ioInstance;
};
exports.getIO = getIO;
// export for service imports (used above)
exports.io = {
    to: (room) => ({ emit: (event, payload) => { if (ioInstance)
            ioInstance.to(room).emit(event, payload); } }),
    emit: (event, payload) => { if (ioInstance)
        ioInstance.emit(event, payload); }
};
