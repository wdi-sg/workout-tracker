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
//CONNECT TO CLIENT----------------------------------
client.connect((err) => {

    if( err ){
      console.log( "error", err.message );
    }
  
    const text = 'SELECT * FROM workouts'
  
    client.query(text, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        console.log("result", res.rows[0]);
      }
    });
  
  });
//-----------------------------------------------------------
// const endConnection = ()=>{
//     ​
//         client.end(err => {
//           console.log('client has disconnected')
//           if (err) {
//             console.log('error during disconnection', err.stack)
//           }
//         })
//     };

//TO-DO LIST CODE--------------------------------
// const fullList = process.argv;
// let commandType = fullList[2];
// let newTodo = fullList[3];
// let doneNumber = fullList[3];



// let newItem = function(){
//   return itemNumber + ". [ ] " + newTodo;
// }


// const jsonfile = require('jsonfile');

// const file = 'data.json'
// const list = require('./data')
// // const entireList =
// if (commandType == "add"){

//     jsonfile.readFile(file, (err, obj) => {


//       let n = obj.todoItems.length+1;
//       obj["todoItems"].push(n + ". [ ] - " + newTodo);
//       obj["itemNames"].push(newTodo);
//       console.log(commandType + "ing new item: " + newTodo);
//       console.log("Your To-Do List is now: " + obj["todoItems"]);

//       jsonfile.writeFile(file, obj, (err) => {
//         console.log(err)
//       })
//       })
//     } else if (commandType == "show"){
//       jsonfile.readFile(file, (err, obj) => {
//         console.log("Your To-Do List is now: " + obj["todoItems"]);

//         jsonfile.writeFile(file, obj, (err) => {
//           console.log(err)
//         })
//         })

//     } else if (commandType == "done"){
//       jsonfile.readFile(file, (err, obj) => {
//         console.log("Done: " + obj["todoItems"][doneNumber-1]);
//         obj["todoItems"][doneNumber-1] = doneNumber+"[X] " + obj["itemNames"][doneNumber-1]
//         console.log("Your To-Do List is now: " + obj["todoItems"]);

//         jsonfile.writeFile(file, obj, (err) => {
//           console.log(err)
//         })
//         })
//     } else if (commandType == "delete"){
//       jsonfile.readFile(file, (err, obj) => {
//         console.log("Removed: " + obj["todoItems"][doneNumber-1]);
//         obj["todoItems"][doneNumber-1] = null;
//         console.log("Your To-Do List is now: " + obj["todoItems"]);

//         jsonfile.writeFile(file, obj, (err) => {
//           console.log(err)
//         })
//         })
// };

//CALL QUERY METHODS (SELECT)--------------------------------
let queryText = 'SELECT * FROM workouts';

client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // iterate through all of your results:
      for( let i=0; i<res.rows.length; i++ ){
        // console.log("result: ", res.rows[i]);
        console.log(res.rows[i].id + ". [ ] - ", res.rows[i].distance + "km - ", res.rows[i].name);
      }
    }
});

//CALL QUERY METHODS (INSERT)--------------------------------
queryText = 'INSERT INTO workouts (distance, name) VALUES ($1, $2) RETURNING id';

const values = [`${process.argv[2]}`, `${process.argv[3]}`];

client.query(queryText, values, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("id of the thing you just created:", res.rows[0].id);
    }
});
