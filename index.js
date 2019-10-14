const pg = require('pg');

const configs = {
    user: 'jasminesis',
    host: '127.0.0.1',
    database: 'testdb',
    port: 5432,
};

/*
██╗     █████╗ ███╗   ███╗     █████╗ ██╗    ██╗███████╗███████╗ ██████╗ ███╗   ███╗███████╗
██║    ██╔══██╗████╗ ████║    ██╔══██╗██║    ██║██╔════╝██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║    ███████║██╔████╔██║    ███████║██║ █╗ ██║█████╗  ███████╗██║   ██║██╔████╔██║█████╗
██║    ██╔══██║██║╚██╔╝██║    ██╔══██║██║███╗██║██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝
██║    ██║  ██║██║ ╚═╝ ██║    ██║  ██║╚███╔███╔╝███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗
╚═╝    ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
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
    if (process.argv[2] == null) {
        console.log("SELECTING")
        let queryText = 'SELECT * FROM workouts ORDER BY id';

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log(res.rows)
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
    } else if (process.argv[2] === "complete") {
        console.log('UPDATING WITH TIME');

        let workoutID = process.argv[3];
        let timeCompleted = process.argv[4];


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

    } else {
        console.log("INSERTING")

        let distance = process.argv[2];
        let name = process.argv[3];
        let time = process.argv[4];

        const values = [distance, name, time];

        let queryText = 'INSERT INTO workouts (distance, name, time) VALUES ($1, $2, $3) RETURNING *';

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("row you just created:", res.rows[0]);
            }
        });
}
})