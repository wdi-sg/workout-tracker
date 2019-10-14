const pg = require("pg");
const configs = {
  user: "nathanaeltan",
  host: "127.0.0.1",
  database: "workouttracker",
  port: 5432
};

const client = new pg.Client(configs);

const whenQueryDone = (err, result) => {
    
   let display = result.rows.map(obj => {
       let box;
       if(obj.completed === null){
           box = '[]'
       } else if (obj.completed === true) {
           box = "[X]"
       }

       let time;
       if(obj.time === null) {
           time = ""
       } else {
           time = obj.time
       }
       return `${obj["id"]}. ${box} - ${obj.distance}km - ${obj.name} - ${time}`
   })
//   console.log("results: ", result.rows);
  console.log(display.join("\n"))
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
  } else if(command === "complete"){
    let id = process.argv[3];
    let time = process.argv[4];
    let inputValues = [id, time]
    const text = "UPDATE workouts SET completed='true', time=$2 WHERE id =$1"

    console.log("MY QUERYYYY: " + text);
    client.query(text, inputValues, whenQueryDone);

  } else {
    const text =
      "SELECT * FROM workouts;";

    console.log("MY QUERYYYY: " + text);
    client.query(text, whenQueryDone);
  }
};

client.connect(whenConnected);
