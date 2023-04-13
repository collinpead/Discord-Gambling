const { user, host, database, password, db_port } = require('../config.json');

const Pool = require('pg').Pool;
const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: db_port,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
});

const getUserById = (request, response) => {
    const uid  = request.params.uid;
    const query = `SELECT * FROM users WHERE uid = ${uid};`;
    pool.query(query,
    (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
};

const getUsersList = (request, response) => {
    const query = `SELECT * FROM users;`;
    pool.query(query,
    (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
};

const postNewUser = (request, response) => {
    const uid = request.params.uid;
    const name = request.params.name;
    const query = `INSERT INTO users (id, name, uid, points) VALUES (DEFAULT, '${name}', ${uid}, 100);`;
    pool.query(query,
    (error) => {
        if (error) {
            throw error
        }
        response.status(200).send();
    });
};

const updatePoints = (request, response) => {
    const uid = request.params.uid;
    const bet = request.params.bet;
    const query = `UPDATE users SET points = points + ${bet} WHERE uid = ${uid};`;
    pool.query(query,
    (error) => {
        if (error) {
            throw error
        }
        response.status(200).send();
    });
};

module.exports = {
    getUsersList,
    getUserById,
    postNewUser,
    updatePoints
};