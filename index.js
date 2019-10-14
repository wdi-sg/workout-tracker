const pg = require('pg');

const configs = {
user: 'home',
host: '127.0.0.1',
database: 'testdb',
port: 5432,
};

const client = new pg.Client(configs);

let queryText;
let checkOff = "[ ]"
let distance = process.argv[3];
let name = process.argv[4];
let command = process.argv[2];

client.connect((err) => {

      if( err ){
        console.log( "error", err.message );
      }

      switch (command){
            case "add":
            addWorkout();
            break;

            case "show":
           showWorkout();
            break;

            case "complete":
            completeWorkout();
            break;

            case "delete":
            deleteWorkout();
      }
})

function addWorkout() {
    queryText = 'INSERT INTO workouts(complete,distance,name) VALUES ($1, $2,$3) RETURNING *';

        const values = [checkOff, distance, name]
        client.query(queryText, values, (err,res)=>{
            if (err){
                console.log("query error", err.message);
                } else {
                  // iterate through all of your results:

                    console.log("added workout: ", `${res.rows[0].id}. ${res.rows[0].complete} - ${res.rows[0].distance}km - ${res.rows[0].name}`);
            }
        })
}

function showWorkout(){
 queryText = 'SELECT * FROM workouts ORDER BY id ASC';
        client.query(queryText, (err,res)=>{
           if (err) {
            console.log("query error", err.message);
        } else {
            for (let i=0; i<res.rows.length; i++){
                if (res.rows[i].time === null){
                    console.log(`${res.rows[i].id}.`, `${res.rows[i].complete} - `, `${res.rows[i].distance}km - `, res.rows[i].name);
                } else {
                    console.log(`${res.rows[i].id}. ${res.rows[i].complete} - ${res.rows[i].distance}km - ${res.rows[i].name} - completed in ${res.rows[i].time} minutes - at a pace of ${res.rows[i].pace}minutes/km`);
                }
            }
          }
        });
}

function completeWorkout(){

    queryText = `SELECT * FROM workouts WHERE id = ${process.argv[3]}`;

        client.query(queryText, (err,res)=>{
            if (err){
                console.log("query error", err.message);
            } else {
            let time = process.argv[4]
            let pace = parseInt(res.rows[0].distance)/parseFloat(time)



             queryText = `UPDATE workouts SET complete = '[x]', time = '${process.argv[4]}', pace = '${pace}' WHERE id = ${process.argv[3]} RETURNING *`
             client.query(queryText, (err,res)=>{
            if (err){
                console.log("query error", err.message);
                } else {
                    console.log("completed workout: ", `${res.rows[0].id}. ${res.rows[0].complete} - ${res.rows[0].distance}km - ${res.rows[0].name} - ${res.rows[0].time} - ${res.rows[0].pace}minutes/km`);
            };
        })

            }
        })




}

function deleteWorkout(){
queryText = `DELETE from workouts WHERE id = ${process.argv[3]}`
        client.query(queryText, (err,res)=>{
            if (err){
                console.log("query error", err.message);
                } else {
                  // iterate through all of your results:

                    console.log("DELETED WORKOUT: " + process.argv[3]);
            };
        })
}