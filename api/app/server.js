const express = require('express');
const morgan = require('morgan');
const clientSession = require('client-sessions');
const helmet = require('helmet');
const app = express();

app.get('/', (req, res) => res.sendStatus(200))
app.get('/health', (req, res) => res.sendStatus(200))

app.use(morgan('short'));
app.use(express.json());
app.use(
  clientSession({
    cookieName: 'session',
    secret: process.env.SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000
  })
);

app.use(helmet());


let server
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app
  },
  stop() {
    server.close()
  }
}