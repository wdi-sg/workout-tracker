const pg = require('pg');

const configs = {
user: 'kellylim',
host: '127.0.0.1',
database: 'kellylim',
port: 5432,
};

const client = new pg.Client(configs);

// let queryText = 'SELECT * FROM workout';

const whenQueryDone =(err, result) => {
  if (err){
    console.log(err)
  } else {
    console.log(result + " HAHAHAHA");
    //console.log("resultTTTTTTTTTTTTTR", result.rows[0]);
    console.log("resultTTTTTTTTTTTTT", result.rows);
  }

}

const whenConnected = (err) => {


    // client.query(queryText, (err, res) => {
    // if (err) {
    //   console.log("query error", err.message);
    // } else {
    //       // iterate through all of your results:
    //       for( let i=0; i<res.rows.length; i++ ){
    //         console.log("result: ", res.rows[i]);
    //       }
    //     }
    // });

  let distance = process.argv[2];
  let name = process.argv[3];

  var inputValues = [distance, name];

  const text = "INSERT INTO workouts (distance,name) VALUES ($1, $2) RETURNING *";

  console.log("MY QUERYYYY: "+text);

  client.query(text, inputValues, whenQueryDone);

  if( err ){
      console.log( "error INSIDE WHEN CONNECTED", err.message );
    }



};



client.connect(whenConnected);