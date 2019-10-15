const pg = require('pg');

const configs = {
user: 'kellylim',
host: '127.0.0.1',
database: 'kellylim',
port: 5432,
};

const client = new pg.Client(configs);

let queryText = 'SELECT * FROM workouts';

var commandType = process.argv[2];
console.log("Your command is: "+commandType);

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


    client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    }

  if (commandType === "add") {
    var commandText = process.argv[3];
    console.log("Your command text is " + commandText);
         if (!res["todoList"]){
            res["todoList"] = [];
        };

  res["todoList"].push(commandText);
  var objectList = res["todoList"];
  console.log("AAA " + objectList);

}

    else {
          // iterate through all of your results:
          for( let i=0; i<res.rows.length; i++ ){
            console.log( (i + 1) + "." + "[ ]" + " - " + objectList[i]);
          }
        }
    });

//======

    let distance = process.argv[3];
    let name = process.argv[4];

    var inputValues = [distance, name];

    const text = "INSERT INTO workouts (distance,name) VALUES ($1, $2) RETURNING *";

    console.log("MY QUERYYYY: "+text);

    client.query(text, inputValues, whenQueryDone);


  if( err ){
        console.log( "error INSIDE WHEN CONNECTED", err.message );
      }


//===================








};


client.connect(whenConnected);