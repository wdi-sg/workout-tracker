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
client.connect((err) => {
    if (err) console.log("CONNECT=",err.message);
    switch (command) {
/*=================================
╦ ╦┌─┐┬  ┌─┐┌─┐┌┬┐┌─┐
║║║├┤ │  │  │ ││││├┤
╚╩╝└─┘┴─┘└─┘└─┘┴ ┴└─┘
=================================*/
        case "sort":
/*=================================
╔═╗┌─┐┬  ┌─┐┌─┐┌┬┐  ╔═╗┬  ┬
╚═╗├┤ │  ├┤ │   │   ╠═╣│  │
╚═╝└─┘┴─┘└─┘└─┘ ┴   ╩ ╩┴─┘┴─┘
=================================*/
        case "select":
            queryText = 'SELECT * FROM workouts';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("QUERY=", err.message);
                } else {
                    res.rows.forEach(workout=>{
                        console.log(`${workout.id}. [${workout.time === null ? " " : "X"}] - ${workout.distance}km - ${workout.name}${workout.time === null ? "" : " - "+workout.time+"m"}`);
                    });
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
                    console.log("result", res.rows[0]);
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
                    console.log("DELETED");
                };
            });
            break;
/*=================================
╔═╗┌─┐┌─┐┌─┐
╠═╝├─┤│  ├┤
╩  ┴ ┴└─┘└─┘
=================================*/
        case "pace":
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    res.rows.forEach(workout=>{
                        workout.time === null ? "" : console.log(`${workout.id}. [X] - ${workout.distance}km - ${workout.time}m - ${(workout.time/workout.distance).toFixed(2)}m/km`);
                    });
                };
            });
            break;
/*=================================
╔═╗┬  ┬┌─┐┬─┐┌─┐┌─┐┌─┐  ╔╦╗┬┌┬┐┌─┐
╠═╣└┐┌┘├┤ ├┬┘├─┤│ ┬├┤    ║ ││││├┤
╩ ╩ └┘ └─┘┴└─┴ ┴└─┘└─┘   ╩ ┴┴ ┴└─┘
=================================*/
        case "average time":
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    let arrayOfCompleted = res.rows.filter(workout=>workout.time !== null);
                    let arrayTimeCompleted = arrayOfCompleted.map(workout=>workout.time);
                    console.log((arrayTimeCompleted.reduce((a,b) => a + b)/arrayTimeCompleted.length).toFixed(2)+'m');
                };
            });
            break;
/*=================================
╔═╗┬  ┬┌─┐┬─┐┌─┐┌─┐┌─┐  ╔╦╗┬┌─┐┌┬┐┌─┐┌┐┌┌─┐┌─┐
╠═╣└┐┌┘├┤ ├┬┘├─┤│ ┬├┤    ║║│└─┐ │ ├─┤││││  ├┤
╩ ╩ └┘ └─┘┴└─┴ ┴└─┘└─┘  ═╩╝┴└─┘ ┴ ┴ ┴┘└┘└─┘└─┘
=================================*/
        case "average distance":
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log(res.rows)
                    let arrayOfCompleted = res.rows.filter(workout=>workout.time !== null);
                    let arrayDistanceCompleted = arrayOfCompleted.map(workout=>workout.distance);
                    console.log((arrayDistanceCompleted.reduce((a,b) => a + b)/arrayDistanceCompleted.length).toFixed(2)+'km');
                };
            });
            break;
/*=================================
╔═╗┌─┐┬─┐┌┬┐
╚═╗│ │├┬┘ │
╚═╝└─┘┴└─ ┴
=================================*/
        case "sort":
            switch (value2) {
                case "time":
                    queryText = (value3 === "descending") ? 'SELECT * FROM workouts ORDER BY time DESC' : 'SELECT * FROM workouts ORDER BY time';
                    break;
                case "distance":
                    queryText = (value3 === "descending") ? 'SELECT * FROM workouts ORDER BY distance DESC' : 'SELECT * FROM workouts ORDER BY distance';
                    break;
                default:
                    console.log("unknown sort parameter");
            };
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    res.rows.forEach(workout=>{
                        console.log(`${workout.id}. [${workout.time === null ? " " : "X"}] - ${workout.distance}km - ${workout.name}${workout.time === null ? "" : " - "+workout.time+"m"}`);
                    });
                };
            });
            break;
        default:
            console.log("command error");
    };
});