/*
.▄▄ · ▄▄▄ .▄▄▄▄▄    ▄• ▄▌ ▄▄▄·
▐█ ▀. ▀▄.▀·•██      █▪██▌▐█ ▄█
▄▀▀▀█▄▐▀▀▪▄ ▐█.▪    █▌▐█▌ ██▀·
▐█▄▪▐█▐█▄▄▌ ▐█▌·    ▐█▄█▌▐█▪·•
 ▀▀▀▀  ▀▀▀  ▀▀▀      ▀▀▀ .▀
*/

let command = process.argv[2];
let input1 = process.argv[3]
let input2 = process.argv[4]
let input3 = process.argv[5]

const pg = require('pg');

const configs = {
    user: 'jasminesis',
    host: '127.0.0.1',
    database: 'testdb',
    port: 5432,
};

/*
┌─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┌─┐┌─┐
├─┘│ │ │ ├─┤ │ │ │├┤ └─┐
┴  └─┘ ┴ ┴ ┴ ┴ └─┘└─┘└─┘
*/

const client = new pg.Client(configs);

client.connect((err) => {

    if (err) {
        console.log("error", err.message);
    }
    /*
       ▄████████    ▄████████  ▄█          ▄████████  ▄████████     ███
      ███    ███   ███    ███ ███         ███    ███ ███    ███ ▀█████████▄
      ███    █▀    ███    █▀  ███         ███    █▀  ███    █▀     ▀███▀▀██
      ███         ▄███▄▄▄     ███        ▄███▄▄▄     ███            ███   ▀
    ▀███████████ ▀▀███▀▀▀     ███       ▀▀███▀▀▀     ███            ███
             ███   ███    █▄  ███         ███    █▄  ███    █▄      ███
       ▄█    ███   ███    ███ ███▌    ▄   ███    ███ ███    ███     ███
     ▄████████▀    ██████████ █████▄▄██   ██████████ ████████▀     ▄████▀
                              ▀
    */
    if (command == null) {
        console.log("SELECTING")
        let queryText = 'SELECT * FROM workouts ORDER BY id';

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                let obj = res.rows;
                obj.forEach(run => {
                    let pace = parseInt(run.time) / parseInt(run.distance);

                    let queryText = `UPDATE workouts SET pace= '${pace} min/km' WHERE id = '${run.id}' RETURNING *`

                    client.query(queryText, (err, res) => {
                        if (err) {
                            console.log("query error", err.message);
                        } else {
                            console.log(res.rows);
                        }
                    });
                })
            }
        });
        /*
        ███    █▄     ▄███████▄ ████████▄     ▄████████     ███        ▄████████
        ███    ███   ███    ███ ███   ▀███   ███    ███ ▀█████████▄   ███    ███
        ███    ███   ███    ███ ███    ███   ███    ███    ▀███▀▀██   ███    █▀
        ███    ███   ███    ███ ███    ███   ███    ███     ███   ▀  ▄███▄▄▄
        ███    ███ ▀█████████▀  ███    ███ ▀███████████     ███     ▀▀███▀▀▀
        ███    ███   ███        ███    ███   ███    ███     ███       ███    █▄
        ███    ███   ███        ███   ▄███   ███    ███     ███       ███    ███
        ████████▀   ▄████▀      ████████▀    ███    █▀     ▄████▀     ██████████

        */
    } else if (command === "complete") {
        console.log('UPDATING WITH TIME');

        let workoutID = input1;
        let timeCompleted = input2;


        let queryText = `UPDATE workouts SET time= '${timeCompleted}' WHERE id = '${workoutID}' RETURNING *`

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("row you just edited:", res.rows[0]);
            }
        });

        /*
         ▄█  ███▄▄▄▄      ▄████████    ▄████████    ▄████████     ███
        ███  ███▀▀▀██▄   ███    ███   ███    ███   ███    ███ ▀█████████▄
        ███▌ ███   ███   ███    █▀    ███    █▀    ███    ███    ▀███▀▀██
        ███▌ ███   ███   ███         ▄███▄▄▄      ▄███▄▄▄▄██▀     ███   ▀
        ███▌ ███   ███ ▀███████████ ▀▀███▀▀▀     ▀▀███▀▀▀▀▀       ███
        ███  ███   ███          ███   ███    █▄  ▀███████████     ███
        ███  ███   ███    ▄█    ███   ███    ███   ███    ███     ███
        █▀    ▀█   █▀   ▄████████▀    ██████████   ███    ███    ▄████▀
                                                   ███    ███
        */

    } else if (command === "add") {
        console.log("INSERTING")

        let distance = input1;
        let name = input2;
        let time = input3;

        const values = [distance, name, time];

        let queryText = 'INSERT INTO workouts (distance, name, time) VALUES ($1, $2, $3) RETURNING *';

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("row you just created:", res.rows[0]);
            }
        });

        /*
        ▓█████▄ ▓█████  ██▓    ▓█████▄▄▄█████▓▓█████
        ▒██▀ ██▌▓█   ▀ ▓██▒    ▓█   ▀▓  ██▒ ▓▒▓█   ▀
        ░██   █▌▒███   ▒██░    ▒███  ▒ ▓██░ ▒░▒███
        ░▓█▄   ▌▒▓█  ▄ ▒██░    ▒▓█  ▄░ ▓██▓ ░ ▒▓█  ▄
        ░▒████▓ ░▒████▒░██████▒░▒████▒ ▒██▒ ░ ░▒████▒
         ▒▒▓  ▒ ░░ ▒░ ░░ ▒░▓  ░░░ ▒░ ░ ▒ ░░   ░░ ▒░ ░
         ░ ▒  ▒  ░ ░  ░░ ░ ▒  ░ ░ ░  ░   ░     ░ ░  ░
         ░ ░  ░    ░     ░ ░      ░    ░         ░
           ░       ░  ░    ░  ░   ░  ░           ░  ░
         ░
        */

    } else if (command === "delete") {
        console.log('DELETING!!!')

        let id = input1;
        let queryText = `DELETE from workouts WHERE id = '${input1}' RETURNING *;`

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("row you just deleted:", res.rows[0]);
            }
        });
    }



})