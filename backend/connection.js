const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.PGURI,
});

client
    .connect()
    .then(() => {
        console.log("connected to db");
    })
    .catch((error) => {
        console.error("error connecting to db", error);
    });

module.exports = client;
