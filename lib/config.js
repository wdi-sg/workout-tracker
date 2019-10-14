const pg = require("pg");

const configs = {
  user: "springfield",
  host: "127.0.0.1",
  database: "track",
  port: 5432,
};

const client = new pg.Client(configs);

module.exports = {client};
