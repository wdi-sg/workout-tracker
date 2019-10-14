const pg = require('pg');


const configs = {
user: 'new_user',
password: 'password',
host: '127.0.0.1',
database: 'david',
port: 5432,
};

const client = new pg.Client(configs);

let actionType = process.argv[2];
let inputDistance = process.argv[3];
let inputName = process.argv[4];
let inputTime = process.argv[5];


const endConnection = ()=>{
	client.end(err => {
	  console.log('client has disconnected')
	  if (err) {
		console.log('error during disconnection', err.stack)
	  }
	})
};



const showData = function () {
	client.connect((err) => {

		if( err ){
			console.log( "error", err.message );
		}
		let queryText = 'SELECT * FROM workout';

		client.query(queryText, (err, res) => {
			if (err) {
				console.log("query error", err.message);
			} else {
			// iterate through all of your results:
				for( let i=0; i<res.rows.length; i++ ){
					console.log("result: ", res.rows[i]);
				}
			}
			endConnection();
		});

	});

}


const addData = function () {
	client.connect((err) => {

	if( err ){
		console.log( "error", err.message );
	}
	let queryText = 'INSERT INTO workout (distance, name, time) VALUES ($1, $2, $3) RETURNING id';

	const values = [inputDistance, inputName, inputTime];
	client.query(queryText, values, (err, res) => {
		if (err) {
			console.log("query error", err.message);
			} else {
			console.log("id of the thing you just created:", res.rows[0].id);
			}
			endConnection();
		});

	});

}


	switch(actionType) {
	  case 'show':
		showData();
	    break;
	  case 'add':
	  	let useQuery = "value";
	  	addData();
	    break;
	  case 'done':
		// doneData(obj);
		// showData(obj);
	    break;
	  case 'delete':
		// deleteData(obj);
		// showData(obj);
	    break;
	   default: 
	   showData();
	}