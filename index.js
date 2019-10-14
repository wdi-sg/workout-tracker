// require the library
const pg = require('pg');

// set all of the configuration in an object
const configs = {
    user: 'siewling',
    host: '127.0.0.1',
    database: 'workouttracker',
    port: 5432,
};

// create a new instance of the client
const client = new pg.Client(configs);

const endConnection = () => {

    client.end(err => {

        console.log("Client has disconnected.");

        if(err) {
            console.log("Error during disconnection", err.stack);
        }
    });
};

// Make sure DB connection is ok
client.connect((err) => {

    if (err) {
        console.log("Connection error: ", err.message);
    }
});

if (process.argv[2] === "insert") {

    // Get user input and store in a variable call inputValues
    let distance = process.argv[3];
    let name = process.argv[4];

    let inputValues = [distance, name];

    const queryText = 'INSERT INTO workout(distance, name) VALUES($1, $2)';

    // Make the query
    client.query(queryText, inputValues, (err, res) => {

        if (err) {

            console.log("Query error: ", err.message);

        } else {

            console.log("done!");
        }
        endConnection();
    });

} else if (process.argv[2] === "select") {

    const queryText = 'SELECT * FROM workout';

    // Make the query
    client.query(queryText, (err, res) => {

        if (err) {

            console.log("Query error: ", err.message);

        } else {

            // Loop through all rows in the DB and display
            for(let i = 0; i < res.rows.length; i++) {

                if (res.rows[i].time === null) {

                    console.log(res.rows[i].id + ". [ ] " + res.rows[i].distance + "km - " + res.rows[i].name);

                } else {

                    console.log(res.rows[i].id + ". [x] " + res.rows[i].distance + "km - " + res.rows[i].name);
                }

            }
        }
        endConnection();
    });

} else if (process.argv[2] === "complete") {

    let id = parseInt(process.argv[3]);
    let timeTaken = process.argv[4];

    let inputValues = [id, timeTaken];

    const queryText = 'UPDATE workout SET time = $2 WHERE id = $1';

    client.query(queryText, inputValues, (err, res) => {

        if (err) {

            console.log("Query error: ", err.message);

        } else {

            console.log("done updating");

        }
        endConnection();
    });
}