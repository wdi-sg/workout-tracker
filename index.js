const pg = require('pg');
const configs = {
    user: 'Sharon',
    host: '127.0.0.1',
    database: 'workoutdb',
    port: 5432,
};

const client = new pg.Client(configs);
const endConnection = () => {
    client.end(err => {
        console.log('client has disconnected!')
        if (err) console.log('error during disconnection' ,err.stack);
    });
};

let comm = process.argv[2];
let value2 = process.argv[3];
let value3 = process.argv[4];
client.connect((err) => {
    if (err) console.log("Connect", err.message);
    switch(command){
        case undefined:
        //welcome
        console.log("Welcome!\nkey 'select' to see all information\nkey 'insert' followed by -distance- -name- to add\nkey 'update' followed by -id- -time- to add time\nkey 'delete' followed by -id- to remove entry\nkey 'pace' to get pace for all runs\nkey 'average time' or 'average distance' to get average of completed workouts\nkey 'sort' followed by -time or distance- -ascending or descending- to sort workouts")
        break;
        //select
        case "select":
        queryText = 'SELECT * FROM workouts';
        client.query(queryText, (err, res) => {
            if (err) {
                console.log("QUERY", err.message);
            }else{
                res.rows.forEach(workout=>{
                    console.log(`${workout.id}. [${workout.time === null ? " " : "X"}] - ${workout.dist}km - ${workout.name}${workout.time === null ? "" : " - "+workout.time+"m"}`);
                });
            };
        });
        break;
        //insert
        case "insert":
        quertText = `INSERT INTO workouts (dist, name) VALUES (${value2}, '${value3}') RETURNING *`;
        client.query(queryText, (err, res) => {
                if (err) {
                    console.log("QUERY=", err.message);
                } else {
                    console.log("result", res.rows[0]);
                };
            });
        break;
        //update
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
            //delete
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
        // pace
        case "pace":
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    res.rows.forEach(workout=>{
                        workout.time === null ? "" : console.log(`${workout.id}. [X] - ${workout.dist}km - ${workout.time}m - ${(workout.time/workout.dist).toFixed(2)}m/km`);
                    });
                };
            });
        break;
        //avetime
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
        // ave dist
        case "average distance":
            queryText = 'SELECT * FROM workouts ORDER BY id';
            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log(res.rows)
                    let arrayOfCompleted = res.rows.filter(workout=>workout.time !== null);
                    let arrayDistCompleted = arrayOfCompleted.map(workout=>workout.dist);
                    console.log((arrayDistCompleted.reduce((a,b) => a + b)/arrayDistCompleted.length).toFixed(2)+'km');
                };
            });
        break;
        //sort
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
                        console.log(`${workout.id}. [${workout.time === null ? " " : "X"}] - ${workout.dist}km - ${workout.name}${workout.time === null ? "" : " - "+workout.time+"m"}`);
                    });
                };
            });
            break;
        default:
            console.log("command error");
    };
});