const pg = require('pg');

const configs = {
    user: 'tanweekiat',
    host: '127.0.0.1',
    database: 'tanweekiat',
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
      console.log("result", res.rows);
    }
  });

});





const whenQueryDone =(err, result) => {
    //console.log("resultTTTTTTTTTTTTTR", result.rows[0]);
    console.log("resultTTTTTTTTTTTTTR", result.rows);
}
const whenConnected = (err) => {

  if( err ){
    console.log( "error INSIDE WHEN CONNECTED", err.message );
  }

  var distance = process.argv[2];
  var name = process.argv[3];


  var inputValues = [distance, name];


  const text = "INSERT INTO workout (distance,name) VALUES ($1, $2) RETURNING *"

  console.log("MY QUERYYYY: "+text);
  client.query(text, inputValues, whenQueryDone);
  // client.query(text, whenQueryDone);
}

client.connect(whenConnected);

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