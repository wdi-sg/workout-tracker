const pg = require("pg");

const configs = {
  user: "Daniel",
  host: "127.0.0.1",
  database: "Daniel",
  port: 5432
};

const client = new pg.Client(configs);

//to log new workout
// let id = process.argv[2];
// let distance = process.argv[3];
// let level = process.argv[4];

// var inputValue = [id, distance, level];

// client.connect(err => {
//   if (err) {
//     console.log("error", err.message);
//   }

//   let text = "INSERT INTO workouts (id, distance, level) VALUES ($1, $2, $3);";

//   client.query(text, inputValue, (err, res) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("logged new exercise!");
//     }
//   });
// });

// to show all logged workouts
client.connect(err => {
  if (err) {
    console.log("error", err.message);
  }

  let text = "SELECT * FROM workouts";

  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i < res.rows.length; i++) {
        console.log("result: " + res.rows[i].id + ". [ ] - " + res.rows[i].distance + " - " + res.rows[i].level);
      }
    }
  });
});
