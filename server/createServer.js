// Instantiates the express server in the const variable 'app'.

const createServer = client => {
  const express = require('express');
  const app = express();
  const { exp_port } = require('../config.json');
  const db = require('./queries');
  const bodyParser = require('body-parser');

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
  }));

  app.get('/users', db.getUsersList);
  
  app.get('/users/:uid', db.getUserById);

  app.post('/users/:uid/:name', db.postNewUser);

  app.post('/bet/:uid/:bet', db.updatePoints);

  app.get('/api', (req, res) => {
    res.json({ info: "Node.js, Express, and Postgres API" });
  });
  
  app.get('/', (req, res) => {
    res.send(`${client.user.username} is live and functional.`)
  });

  app.listen(exp_port, () => {
    console.log(`Express server live on port ${exp_port}`);
  });
  return app;
};

module.exports = {
    createServer
};