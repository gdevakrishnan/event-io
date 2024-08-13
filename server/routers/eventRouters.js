const express = require('express');
const { addEvent } = require('../controllers/eventControllers');
const routers = express.Router();

routers.post('/add-event', addEvent);

module.exports = ("eventRouters", routers);