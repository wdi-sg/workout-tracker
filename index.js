//REQUIRE LIBRARY------------------------------------
const pg = require('pg');
//SET OBJECT CONFIG----------------------------------
const configs = {
    user: '13InchWong',
    host: '127.0.0.1',
    database: 'workout_tracker',
    port: 5432,
    };
//CREATE NEW INSTANCE OF CLIENT----------------------
const client = new pg.Client(configs);
//CONNECT TO CLIENT #1----------------------------------
client.connect((err) => {

    if( err ){
      console.log( "error", err.message );
    }
  
    const text = 'SELECT * FROM workouts'
  
    client.query(text, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        console.log("That's it!");
      }
    });
  
  });
//CONNECT TO CLIENT #2----------------------------------
// const endConnection = ()=>{
//     ​
//         client.end(err => {
//           console.log('client has disconnected')
//           if (err) {
//             console.log('error during disconnection', err.stack)
//           }
//         })
//     };

//CALL QUERY METHODS (SELECT)--------------------------------
if (process.argv[2] === "show") {
    let queryText = 'SELECT * FROM workouts';
    client.query(queryText, (err, res) => {
        if (err) {
        console.log("query error", err.message);
        } else {
        // iterate through all of your results:
            for( let i=0; i<res.rows.length; i++ ){
                if (res.rows[i].time !== null){
                    console.log(res.rows[i].id + ". [X] - ", res.rows[i].distance + "km - ", res.rows[i].name + " - ", res.rows[i].time);
                } else {
                console.log(res.rows[i].id + ". [ ] - ", res.rows[i].distance + "km - ", res.rows[i].name + " - ", res.rows[i].time);
                }
            }
        }
    });
} else if (process.argv[2]==="complete") {
    // queryText = 'UPDATE workouts SET time = process.argv[4] WHERE id = process.argv[3] RETURNING *';
    // queryText = `UPDATE workouts SET time = ${process.argv[4]} WHERE id = ${process.argv[3]} RETURNING *';
    // queryText = 'UPDATE workouts SET time = `${process.argv[4]}` WHERE id = `${process.argv[3]}` RETURNING *';
    let value3 = process.argv[3];
    let value4 = process.argv[4];
    queryText = `UPDATE workouts SET time = ${value4} WHERE id = ${value3} RETURNING *`;

    console.log("QQQ+++++++++++++++++++++++++++++++++++");
    client.query(queryText, (err, res) => {
        if (err) {
          console.log("query error", err.message);
        } else {
          console.log("id of the thing you just completed:", res.rows[0].id);
        }
    });
} else {

    queryText = 'INSERT INTO workouts (distance, name) VALUES ($1, $2) RETURNING id';
    console.log("WWW___________________________________");
    const values = [`${process.argv[2]}`, `${process.argv[3]}`];

    client.query(queryText, values, (err, res) => {
        if (err) {
        console.log("query error", err.message);
        } else {
        console.log("id of the thing you just created:", res.rows[0].id);
        }
    });
}

//CALL QUERY METHODS (INSERT)--------------------------------


//CALL QUERY METHODS (UPDATE)--------------------------------
