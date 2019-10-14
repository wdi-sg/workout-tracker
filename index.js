const pg = require('pg');

const configs = {
user: 'ryan',
host: '127.0.0.1',
database: 'workouttracker',
port: 5432,
};

const client = new pg.Client(configs);

client.connect((err) => {

    if( err ){
    console.log( "error", err.message );
    };


    if(process.argv[2] === "add"){

        let exercise = process.argv[3];
        let distance = process.argv[4];

        let inputValues = [exercise, distance];

        let queryText = "INSERT INTO workouts (exercise, distance) VALUES ($1, $2) RETURNING *";

        if (distance === undefined){
            console.log("Please input the distance and type of exercise!");
        } else if (exercise === undefined){
            console.log("Please input the distance and type of exercise!");
        } else {
            client.query(queryText, inputValues, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                  console.log("I've added ["+inputValues+"] into the database!\nID: "+res.rows[0].id + "\nDistance: " + res.rows[0].distance + "\nType of exercise: " + res.rows[0].exercise);
                };
            });
        };

    } else if (process.argv[2] === "complete"){

        let ID = process.argv[3];
        let time = process.argv[4];
        let updated = new Date();

        let inputValues = [ID, time];

        let queryText = "UPDATE workouts SET time = ($2), updated_at = '"+updated+"' WHERE id = ($1) RETURNING *";

        if (ID === undefined){
            console.log("Please input the ID and the time it took to complete the exercise!");
        } else if (time === undefined){
            console.log("Please input the ID and the time it took to complete the exercise!");
        } else {
            client.query(queryText, inputValues, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                  console.log("I've completed exercise: " + res.rows[0].exercise + " for " + res.rows[0].distance + "! \nThe time it took was " + res.rows[0].time + "!");
                };
            });
        }
    } else if (process.argv[2] === "delete"){

        let deleteID = process.argv[3];

        let inputValues = [deleteID];

        let deleteText = "DELETE from students WHERE id = ($1) RETURNING *";

        if(deleteID === undefined){
            console.log("Please input the ID that you want to delete!");
        } else {
            client.query(deleteText, inputValues, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                  console.log("I've deleted ID #"+deleteID+" from the database!\n name: "+res.rows[0].name+"\nPhone: "+res.rows[0].phone+"\nEmail: "+res.rows[0].email);
                };
            });
        };



    }








    else {
        console.log("Welcome to workout tracker!\nTo add into the database, please input 'add' followed by distance of the workout and the type of the workout (e.g. add run 12km). \nTo mark down the completeness of the workout, please input 'complete' followed by the ID of the workout and the time it took to complete the workout (e.g. complete 1 1.5hrs) ");
    };


});