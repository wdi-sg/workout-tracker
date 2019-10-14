const pg = require('pg');

const configs = {
  user: 'garrick',
  host: '127.0.0.1',
  database: 'garrick',
  port: 5432
};

const client = new pg.Client(configs);

client.connect((err) => {
  if(err) {
    console.log("error", err.message);
  }

  let queryText = 'INSERT INTO workouts (distance, name, done, time) VALUES ($1, $2, $3, $4) RETURNING id';

  const values = [process.argv[2], process.argv[3], '[ ]', process.argv[4]];

  client.query(queryText, values, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i < res.rows.length; i++) {
        console.log(`${res.rows[i].id}. - ${res.rows[i].done} - ${res.rows[i].distance}km - ${res.rows[i].name} - ${res.rows[i].time}`);
      };
    }
  });

  let text = 'SELECT * FROM workouts';
  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i < res.rows.length; i++) {
        console.log(`${res.rows[i].id}. - ${res.rows[i].done} - ${res.rows[i].distance}km - ${res.rows[i].name} - ${res.rows[i].time}`);
      };
    }
  });
});

