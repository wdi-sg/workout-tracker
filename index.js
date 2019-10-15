const pg = require('pg');


const configs = {
user: 'eugene',
host: '127.0.0.1',
database: 'testdb',
port: 5432,
};

const client = new pg.Client(configs);


client.connect((err) => {

  if( err ){
    console.log( "error", err.message );
  }

  const text = 'SELECT * FROM workout'

  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", res.rows[0]);
    }
  });

});

const whenQueryDone =(err, result) => {

    console.log("resultTTTTTTTTTTTTTR", result.rows);
}

const whenConnected = (err) => {

  if( err ){
    console.log( "ERROR ", err.message );
  }

  var distance = process.argv[2];
  var name = process.argv[3];
  var time = process.argv[4];

  var inputValues = [distance, name, time];


  const text = "INSERT INTO workout (distance, name, time) VALUES ($1, $2, $3) RETURNING *"

  // console.log("MY QUERYYYY: "+text);

  client.query(text, inputValues, whenQueryDone);
  // client.query(text, whenQueryDone);
}


let queryText = 'SELECT * FROM workout';

client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // iterate through all of your results:
      for( let i=0; i<res.rows.length; i++ ){
        console.log("[ ]", res.rows[i]);
      }
    }
});


if (process.argv[2] !== undefined) {client.connect(whenConnected)};