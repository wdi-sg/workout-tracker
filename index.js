const pg = require('pg');
const configs = {
user: 'kevin',
host: '127.0.0.1',
database: 'testdb',
port: 5432,
};
const client = new pg.Client(configs);
const endConnection = () => {
    client.end(err => {
        console.log('client has disconnected')
        if (err) console.log('error during disconnection', err.stack);
    });
};
/*=================================
╔╗ ┌─┐┬┬  ┌─┐┬─┐┌─┐┬  ┌─┐┌┬┐┌─┐
╠╩╗│ │││  ├┤ ├┬┘├─┘│  ├─┤ │ ├┤
╚═╝└─┘┴┴─┘└─┘┴└─┴  ┴─┘┴ ┴ ┴ └─┘
=================================*/
let command = process.argv[2];
let value2 = process.argv[3];
let value3 = process.argv[4];
console.log(command);
console.log(value2);
console.log(value3);
client.connect((err) => {
    if (err) console.log("CONNECT=",err.message);
    switch (command) {
/*=================================
╔═╗┌─┐┬  ┌─┐┌─┐┌┬┐
╚═╗├┤ │  ├┤ │   │
╚═╝└─┘┴─┘└─┘└─┘ ┴
=================================*/
        case "select":
            queryText = 'SELECT * FROM workouts';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("QUERY=", err.message);
                } else {
                    console.log("RESULT=", res.rows);
                };
            });
            break;
/*=================================
╦┌┐┌┌─┐┌─┐┬─┐┌┬┐
║│││└─┐├┤ ├┬┘ │
╩┘└┘└─┘└─┘┴└─ ┴
=================================*/
        case "insert":
            queryText = `INSERT INTO workouts (distance, name) VALUES (${value2}, '${value3}') RETURNING *`;
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("QUERY=", err.message);
                } else {
                    console.log("RESULT=", res.rows[0]);
                };
            });
            break;
/*=================================
╦ ╦┌─┐┌┬┐┌─┐┌┬┐┌─┐
║ ║├─┘ ││├─┤ │ ├┤
╚═╝┴  ─┴┘┴ ┴ ┴ └─┘
=================================*/
        case "update":
            queryText = `UPDATE workouts SET time=${value3} WHERE id=${value2} RETURNING *`;
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("result", res.rows[0]);
                };
            });
            break;
/*=================================
╔╦╗┌─┐┬  ┌─┐┌┬┐┌─┐
 ║║├┤ │  ├┤  │ ├┤
═╩╝└─┘┴─┘└─┘ ┴ └─┘
=================================*/
        case "delete":
            queryText = `DELETE FROM workouts WHERE id=${value2}`;
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("result", res.rows[0]);
                };
            });
            break;
/*=================================
╦ ╦┌┐┌┌┬┐┌─┐┌─┐┬┌┐┌┌─┐┌┬┐
║ ║│││ ││├┤ ├┤ ││││├┤  ││
╚═╝┘└┘─┴┘└─┘└  ┴┘└┘└─┘─┴┘
=================================*/
        case undefined:
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("result", res.rows);
                    res.rows.forEach(workout=>{
                        workout.time === null ? "" : console.log(`${workout.id}. [X] - ${workout.distance}km - ${workout.time}m - ${(workout.time/workout.distance).toFixed(2)}m/km`);
                    });
                };
            });
            break;
        default:
            console.log("command error");
    };
});