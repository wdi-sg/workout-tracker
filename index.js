const pg = require("pg");

// get user input from the command line
let userInput = process.argv;
let input1 = userInput[2];
let input2 = userInput[3];
let input3 = userInput[4];

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

const getOutputText = res => {
  let outputText = "";
  let workouts = res.rows;

  for (let i = 0; i < workouts.length; i++) {
    let outputTime = "";
    let outputPace = "";
    if (workouts[i].time) {
      let minutes = "";
      let seconds = "";
      let pace = "";
      let distance = +workouts[i].distance;

      if (workouts[i].time.includes(".")) {
        let time = workouts[i].time.split(".");
        minutes = +time[0];
        seconds = +time[1];
        pace = ((minutes + seconds / 60) / distance).toFixed(2);
      } else {
        minutes = +workouts[i].time;
        seconds = 0;
        pace = (minutes / distance).toFixed(2);
      }
      outputTime = ` - ${+minutes <= 9 ? "0" + minutes : minutes}:${
        +seconds <= 9 ? "0" + seconds : seconds
      }`;

      outputPace = ` - ${pace}  min/km`;
    }

    outputText += `${i + 1}. ${workouts[i].time ? "[ X ]" : "[   ]"} - ${
      workouts[i].distance
    }km - ${workouts[i].name} ${outputTime} ${outputPace}\n`;
  }

  return outputText;
};

client.connect(err => {
  if (err) {
    console.log("error", err.message);
  }

  // when there are 2 inputs, e.g. node index 3.3 "run"
  if (input1 && input2 && input1 !== "average") {
    const values = [input1, input2];

    const queryText =
      "INSERT INTO workouts (distance, name) VALUES ($1, $2) RETURNING *";

    client.query(queryText, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
        endConnection();
      } else {
        let outputText = `Added: distance: ${res.rows[0].distance}, name: "${res.rows[0].name}"`;
        console.log(outputText);
        endConnection();
      }
    });
    // when there are 3 inputs, e.g. node index complete 1 33
  } else if (input1 === "complete" && input2 && input3) {
    const queryText = "SELECT * FROM workouts ORDER BY id";

    client.query(queryText, (err, res) => {
      if (err) {
        console.log("query error", err.message);
        endConnection();
      } else {
        let inputId = +input2;
        let inputTime = input3;
        let workouts = res.rows;
        let workoutId = workouts[inputId - 1].id;

        const queryText =
          "UPDATE workouts SET time = " +
          inputTime +
          "WHERE id = " +
          workoutId +
          "RETURNING *";

        client.query(queryText, (err, res) => {
          if (err) {
            console.log("query error", err.message);
            endConnection();
          } else {
            console.log(
              `Updated: \n distance: ${res.rows[0].distance}, name: ${res.rows[0].name}, time: ${res.rows[0].time}`
            );
            endConnection();
          }
        });
      }
    });
    // when there are is no input, e.g. node index
  } else if (input1 === "average") {
    let queryText = "";
    if (input2 === "distance") {
      queryText =
        "SELECT to_char(AVG (distance), '9999D99') AS average FROM workouts WHERE time IS NOT NULL";
    } else if (input2 === "time") {
    queryText =
    "SELECT to_char(AVG (time), '9999D99') AS average FROM workouts WHERE time IS NOT NULL";
    } else {
      console.log("Please enter either: average distance OR average time");
      endConnection();
    }

    client.query(queryText, (err, res) => {
      if (err) {
        console.log("query error", err.message);
        endConnection();
      } else {
        console.log(`Average ${input2}: ${res.rows[0].average} ${input2 === "distance" ? "km" : "min"}`);
        endConnection();
      }
    });
  } else {
    const queryText = "SELECT * FROM workouts ORDER BY id";

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
