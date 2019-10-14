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
                console.log(res.rows[i].id + ". [ ] " + res.rows[i].distance + "km - " + res.rows[i].name);
            }
        }
    });
}

