const pg = require('pg');

const configs = {
user: 'syahirah',
host: '127.0.0.1',
database: 'workout',
port: 5432,
};

const client = new pg.Client(configs);
//////////////////////////CODES BELOW//////////////////////////////////

//connects to client
client.connect((err) => {
    if (err){
        console.log("error", err.message);
    }

//depending on user command, run this
let userInput = process.argv[2];
switch (userInput) {
    case 'show':
                let record = 'SELECT * FROM tracker';
                client.query(record, (err, res) => {
                    if (err){
                    console.log("query error", err.message);
                    } else {
                        for (let i=0; i<res.rows.length; i++){
                        console.log(res.rows[i].id + ". [] - " + res.rows[i].distance + "km - " + res.rows[i].name);
                        };
                    };
                });
                break;
    case 'add':
                let firstValue = process.argv[3];
                let secondValue = process.argv[4];

                let inputValues = [firstValue, secondValue];
                let newRecord = "INSERT INTO tracker (distance, name) VALUES ($1, $2)";

                client.query(newRecord, inputValues, (err, res) => {
                    if (err){
                    console.log("query error", err.message);
                    } else {
                    console.log("added!");
                    };
                });
                break;
};
});