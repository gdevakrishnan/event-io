const express = require('express');
const { addEvent, getEvents, joinEvent } = require('../controllers/eventControllers');
const routers = express.Router();

routers.get('/', getEvents);
routers.post('/add-event', addEvent);
routers.post('/join/:id', joinEvent);

module.exports = ("eventRouters", routers);