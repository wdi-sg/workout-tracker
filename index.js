const pg = require('pg');
const configs = {
    user: 'datguyrhy',
    host: '127.0.0.1',
    database: 'workoutdb',
    port: 5432,
};
302

const client = new pg.Client(configs);
const whenQueryDone = (err, res) => {
    console.log("resultTTTTTTTTTTTTTR", res.rows);
}

//this connects 'client' to database///////////
client.connect((err) => {

    if (err) {
        console.log("error", err.message);
    }
    var inputValues = [process.argv[2], process.argv[3], process.argv[4]];

    const text = 'SELECT * FROM workout'
    client.query(text, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        }
        //adds new workout
        const myCommand = process.argv[2];
        let completion = process.argv[3];
        let distance = process.argv[4];
        let level = process.argv[5];
        var inputValues = [completion, distance, level];
        //add new workout program
        if (myCommand === "add") {
            let queryText = "INSERT INTO workout(completion,distance,level) VALUES($1,$2,$3)";
            client.query(queryText, inputValues);
            console.log("yay new workout added");
        }
        // updates completion status
        //// refer to error
        else if (myCommand === "complete") {
            let id = [process.argv[3]]
            let updateStatus = "UPDATE workout SET completion = '[X]' WHERE id= $1";
            client.query(updateStatus, id);
            console.log("yay workout" + id[0] + "completed");

        }

        // updates time
        else if (myCommand === "time") {
            let time = [process.argv[3], process.argv[4]]
            let updateStatus = "UPDATE workout SET time = $2 WHERE id= $1";
            client.query(updateStatus, time);
            console.log("yay time add " + time[1]);
        }


    });
});
