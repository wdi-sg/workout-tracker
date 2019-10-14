const pg = require("pg");

const configs = {
    user: "Daniel",
    host: "127.0.0.1",
    database: "Daniel",
    port: 5432
};

const client = new pg.Client(configs);

//to log new workout
let id = process.argv[3];
let distance = process.argv[4];
let level = process.argv[5];

var inputValue = [id, distance, level];

client.connect(err => {
    if (err) {
        console.log("error", err.message);
    }

    //   showing workouts
    if (process.argv[2] === "show") {
        console.log("showing workouts!");
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

        // add workouts
    } else if (process.argv[2] === "add") {
        let text = "INSERT INTO workouts (id, distance, level) VALUES ($1, $2, $3);";

        client.query(text, inputValue, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("logged new exercise!");
            }
        });

        // help!!!
        // } else if (process.argv[2] === "completed") {
        //     let workouts = "SELECT * FROM workouts";
        //     let workoutId = process.argv[3];
        //     let workoutTime = process.argv[4];
        //     let text = `UPDATE workouts SET time = ${workoutTime} WHERE id = ${workoutId}`;
        //     client.query(text, (err, res) => {
        //         if (err) {
        //             console.log("query error", err.message);
        //         } else {
        //             console.log(`${workouts}.res.row[workoutId].distance}`)
        //             // console.log(`${workoutId}. [X] - ${workouts.rows.distance} - ${workouts.level} - ${workouts.time}`);
        //         }
        //     });
        // }

    }
});

// to show all logged workouts
// client.connect(err => {
//   if (err) {
//     console.log("error", err.message);
//   }

//   let text = "SELECT * FROM workouts";

//   client.query(text, (err, res) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       for (let i = 0; i < res.rows.length; i++) {
//         console.log("result: " + res.rows[i].id + ". [ ] - " + res.rows[i].distance + " - " + res.rows[i].level);
//       }
//     }
//   });
// });