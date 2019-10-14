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
                  console.log(res.rows[0].id + ". [] - " + res.rows[0].exercise + " - " + res.rows[0].distance + " - " + res.rows[0].created_at);
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
                  console.log(res.rows[0].id + ". [x] - " + res.rows[0].exercise + " - " + res.rows[0].distance + " - " + res.rows[0].time + " - " + res.rows[0].updated_at);
                };
            });
        }
    } else if (process.argv[2] === "delete"){

        let deleteID = process.argv[3];

        let inputValues = [deleteID];

        let deleteText = "DELETE from workouts WHERE id = ($1) RETURNING *";

        if(deleteID === undefined){
            console.log("Please input the ID that you want to delete!");
        } else {
            client.query(deleteText, inputValues, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                  console.log("I've deleted ID #"+deleteID+" from the database!\nExercise: "+res.rows[0].exercise+"\nDistance: "+res.rows[0].distance);
                };
            });
        };



    } else if (process.argv[2] === "get"){

        if(process.argv[3] === "asc"){

            let queryText = "SELECT * FROM workouts ORDER BY id ASC";

            client.query(queryText, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                      for(i=0; i<res.rows.length; i++){
                            if(res.rows[i].time !== null){
                                console.log(res.rows[i].id + ". [x] - " + res.rows[i].exercise + " - " + res.rows[i].distance + " - " + res.rows[i].time + " - " + res.rows[i].updated_at);
                            };
                      };
                };
            });

        } else if (process.argv[3] === "dsc"){

            let queryText = "SELECT * FROM workouts ORDER BY id DESC";

            client.query(queryText, (err, res) => {
                if (err) {
                  console.log("query error", err.message);
                } else {
                      for(i=0; i<res.rows.length; i++){
                            if(res.rows[i].time !== null){
                                console.log(res.rows[i].id + ". [x] - " + res.rows[i].exercise + " - " + res.rows[i].distance + " - " + res.rows[i].time + " - " + res.rows[i].updated_at);
                            };
                      };
                };
            });

        } else {
            console.log("please enter 'asc' or 'dsc' ");
        }

    } else {

        let queryText = "SELECT * FROM workouts ORDER BY id ASC";
                console.log("Welcome to workout tracker!\nTo add into the database, please input 'add' followed by distance of the workout and the type of the workout (e.g. add run 12km). \nTo mark down the completeness of the workout, please input 'complete' followed by the ID of the workout and the time it took to complete the workout (e.g. complete 1 1.5hrs) \nTo delete a workout, please input 'delete' followed by the ID of the workout (e.g. delete 1) \nTo get a list of completed workouts ordered by time (ascending and descending), please input 'get' followed by 'asc' or 'dsc' (e.g. get asc) ");

        client.query(queryText, (err, res)=>{
            for(i=0; i<res.rows.length; i++){
                console.log(res.rows[i].id + ". [] - " + res.rows[i].exercise + " - " + res.rows[i].distance + " - " + res.rows[i].created_at);
            };
        });
    };


});