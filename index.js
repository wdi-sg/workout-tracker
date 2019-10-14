const pg = require('pg');

//connecting to database
const configs = {
user: 'sirron',
host: '127.0.0.1',
database: 'sirron',
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
    //console.log("resultTTTTTTTTTTTTTR", result.rows[0]);
    console.log("resultTTTTTTTTTTTTTR", result.rows);
}

//create new rows for distance and name
const whenConnected = (err) => {

  if( err ){
    console.log( "error INSIDE WHEN CONNECTED", err.message );
  }

  var distance = process.argv[2];
  var name = process.argv[3];

  var inputValues = [distance, name];

  const text = "INSERT INTO workout (distance, name) VALUES ($1, $2) RETURNING *"

  console.log("MY QUERYYYY: "+text);
  client.query(text, inputValues, whenQueryDone);
  // client.query(text, whenQueryDone);
};

client.connect(whenConnected);




// const endConnection = ()=>{
// ​
// 	client.end(err => {
// 	  console.log('client has disconnected')
// 	  if (err) {
// 		console.log('error during disconnection', err.stack)
// 	  }
// 	})
// };