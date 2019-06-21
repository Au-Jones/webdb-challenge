const express = require('express');
const server = express();
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development)

server.use(express.json())


const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\nRunning on port ${port}\n`))