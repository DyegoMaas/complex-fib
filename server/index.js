const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.PgDatabase,
    password: keys.PgPassword,
    port: keys.PgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));
pgClient
    .query('CREATE TABLE IF NOT EXISTS Values (number INT)')
    .catch(error => console.log(error));

// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/api/', (req, res) => {
    res.send('Hi');
})

app.get('/api/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM Values');
    res.send(values.rows);
});

app.get('/api/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/api/values', async (req, res) => {
    const { index } = req.body;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high!')
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO Values (number) values ($1)', [index]);

    res.send({ working: true });
});

app.listen(6000, () => {
    console.log('Listening on port 6000');
})
