const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function greeter(teamName) {
  return function(req, res, next) {
    req.team = teamName

    next()
  }
}

function time(req, res, next) {
    const seconds = new Date().getSeconds()
    if (seconds % 3 === 0) {
      return res.status(404).end()
    } else {
      next()
    }
}

server.use(express.json());
server.use(helmet())
server.use(morgan('dev'))
server.use(greeter('Web XVIII'))

server.use('/api/hubs', restricted, only('gimli'), hubsRouter);

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to ${req.team}</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password

  if (password === 'mellon') {
    next()
  } else {
    res.status(401).send('you shall not pass!')
  }
}

function only(name) {
  return function name(req, res, next) {
  const name = req.headers.name
  if (name === 'gimli') {
    next()
  } else {
    res.status(403).send("you're not gimli!")
  }
}
}

module.exports = server;
