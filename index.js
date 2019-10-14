//set up
const pg = require('pg');

const configs = {
    user: 'mariadimitrijevic',
    host: '127.0.0.1',
    database: 'workouts',
    port: 5432,
};

const client = new pg.Client(configs);

//create a table: id distance name, time later
// id | workout | distance | time =>  serial primary key| text | float | timestamp


// !!! change time datatype from timestamp to time
// !!! add colomn for done, and sort by some order, asc od workout type
// !! add pace

//joining commands
let command = process.argv[2];
let value2 = process.argv[3];
let value3 = process.argv[4];
let value4 = process.argv[5];

client.connect((err) => {
    switch (command) {
        case 'select':
            select();
            break;
        case 'insert':
            insert(value2, value3, value4);
            break;
        case 'dlt':
            dlt(value2);
            break;
    }
});


//select
const select = () => {
    client.connect((err) => {

        if (err) {
            console.log("error", err.message);
        }
        let queryText = 'SELECT * FROM workouts'
        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    // console.log("result: ", res.rows[i]);
                    console.log("result", res.rows[i]);
                    // console.log(`${res.rows[i].id}.  ${res.rows[i].workout}  ${res.rows[i].distance}  ${res.rows[i].time}`);
                }

            };
        });
    });
};


//insert
const insert = (value2, value3, value4) => {


    client.connect((err) => {
        let queryText = 'INSERT INTO workouts (workout, distance, time) VALUES ($1, $2, $3) RETURNING id';

        // const values = [process.argv[2], process.argv[3], process.argv[4]];
        const values = [value2, value3, value4];

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("result", res.rows[0].id);

            }
        });
    });
};

//delete

const dlt = (value2) => {
    client.connect((err) => {
        const value2 = process.argv[3];
        let queryText = `DELETE FROM workouts WHERE id = '${value2}'`;

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log(`Deleted workout id = ${value2}`);
            }
        });
    });
};