const Server = require('./server');

require('dotenv').config()

Server.start(process.env.PORT);