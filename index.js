const pg = require("pg");

// get user input from the command line
let userInput = process.argv;
let inputDistance = userInput[2];
let inputName = userInput[3];

// config for logging into database
const configs = {
  user: "hongjin",
  host: "127.0.0.1",
  database: "workout_tracker",
  port: 5432
};

const client = new pg.Client(configs);

// function for ending connection to database
const endConnection = () => {
  client.end(err => {
    // console.log("client has disconnected");
    console.log("************************");
    if (err) {
      console.log("error during disconnection", err.stack);
    }
  });
};

const getOutputText = (res) => {
    let outputText = "";
    let workouts = res.rows;

    for (let i = 0; i < workouts.length; i++) {
        outputText += `${i+1}. [ ] - ${workouts[i].distance}km - ${workouts[i].name}\n`;
    }
    
    return outputText;
};

client.connect(err => {
  if (err) {
    console.log("error", err.message);
  }

  // when there is input given, e.g. node index.js 3.3 "jog around the house"
  if (inputDistance && inputName) {
    const values = [inputDistance, inputName];

    const queryText =
      "INSERT INTO workouts (distance, name) VALUES ($1, $2) RETURNING *";

    client.query(queryText, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
        endConnection();
      } else {
        let outputText = `Added: ${res.rows[0].distance} "${res.rows[0].name}".`;
        console.log(outputText)
        endConnection();
      }
    });
  } else {
    const queryText = "SELECT * FROM workouts";

    client.query(queryText, (err, res) => {
      if (err) {
        console.log("query error", err.message);
        endConnection();
      } else {
        let outputText = getOutputText(res);
        console.log(outputText);

        endConnection();
      }
    });
  }
});
