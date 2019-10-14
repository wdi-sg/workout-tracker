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

  switch(process.argv[2]) {
    case 'show':
      show();
      break;
    case 'add':
      add(process.argv[3], process.argv[4]);
      break;
    case 'complete':
      complete(process.argv[3], process.argv[4]);
      break;
    case 'remove':
      remove(process.argv[3]);
      break;
  }
});

const show = () => {
  let text = 'SELECT * FROM workouts ORDER BY id ASC';
  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i < res.rows.length; i++) {
        console.log(`${res.rows[i].id}. - ${res.rows[i].done} - ${res.rows[i].distance}km - ${res.rows[i].name} - ${res.rows[i].time}`);
      };
    }
  });
}

const add = (v1, v2) => {
  let text = 'INSERT INTO workouts (distance, name, done) VALUES ($1, $2, $3) RETURNING *';
  const values = [v1, v2, '[ ]'];

  client.query(text, values, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        console.log(`added: ${res.rows[0].id}. - ${res.rows[0].done} - ${res.rows[0].distance}km - ${res.rows[0].name} - ${res.rows[0].time}`);
    }
  });
}

const complete = (v1, v2) => {
  let text = `UPDATE workouts SET done = '[x]', time = '${v2}' WHERE id = '${v1}' RETURNING *`;
  
  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        console.log(`updated: ${res.rows[0].id}. - ${res.rows[0].done} - ${res.rows[0].distance}km - ${res.rows[0].name} - ${res.rows[0].time}`);
    }
  });
}

const remove = (v1) => {
  let text = `DELETE FROM workouts WHERE id = '${v1}'`;
  
  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        console.log(`Deleted id = ${v1}`);
    }
  });
}
