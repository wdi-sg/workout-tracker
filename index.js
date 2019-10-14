const pg = require("pg");
const configs = {
  user: "nathanaeltan",
  host: "127.0.0.1",
  database: "workouttracker",
  port: 5432
};

const client = new pg.Client(configs);

const whenQueryDone = (err, result) => {
  console.log("results: ", result.rows);
};

const whenConnected = err => {
  if (err) {
    console.log("error INSIDE WHEN CONNECTED", err.message);
  }
  let command = process.argv[2];
  if (command === "add") {
    let distance = process.argv[3];
    let name = process.argv[4];

    let inputValues = [distance, name];
    const text =
      "INSERT INTO workouts (distance, name) VALUES ($1, $2) RETURNING *";

    console.log("MY QUERYYYY: " + text);
    client.query(text, inputValues, whenQueryDone);
  }
};

client.connect(whenConnected);
