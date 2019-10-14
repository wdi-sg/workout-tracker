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
let outputTime = "";
let orderBy = "";

console.log('Commands: index.js (shows all), add distance name time, number done, number delete, sort a (ascending by run time) d (descending)')

const endConnection = ()=>{
	client.end(err => {
	  console.log('client has disconnected')
	  if (err) {
		console.log('error during disconnection', err.stack)
	  }
	})
};



const showData = function () {
console.log("No.    Distance   Name        Time");

	client.connect((err) => {

		if( err ){
			console.log( "error", err.message );
		}
		let queryText = 'SELECT * FROM workout'+ orderBy;

		client.query(queryText, (err, res) => {
			if (err) {
				console.log("query error", err.message);
			} else {
			// iterate through all of your results:
				for( let i=0; i<res.rows.length; i++ ){
					// console.log("result: ", res.rows[i]);
					let displayNumber = i+1;
					let done = " ";
					if (res.rows[i].time > 0 ) {
						done = "x";
						outputTime = res.rows[i].time;
					} else {
						outputTime = "";
					}

					console.log(displayNumber +'.  ['+done+'] - ' + res.rows[i].distance + '    ' + res.rows[i].name + '       ' + outputTime );

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

// done needs a time to update
const doneData = function () {
	// console.log('done entered')
	client.connect((err) => {

	if( err ){
		console.log( "error", err.message );
	}
	let queryText = "UPDATE workout SET time="+process.argv[4]+" WHERE id ="+process.argv[3];

	client.query(queryText, (err, res) => {
	    if (err) {
	      console.log("query error", err.message);
	    } else {
	      console.log("done!");
	    }
	    endConnection();
	});

	});

}


const deleteData = function () {
	// console.log('delete entered')
	client.connect((err) => {

	if( err ){
		console.log( "error", err.message );
	}
	let queryText = "DELETE from workout WHERE id ="+process.argv[3];

	client.query(queryText, (err, res) => {
	    if (err) {
	      console.log("query error", err.message);
	    } else {
	      console.log("done!");
	    }
	    endConnection();
	});

	});

}

// ORDER BY column_name, column_name ASC

const sortData = function () {
	console.log("sort data start!");
	if (process.argv[3] === 'a') {
		orderBy= ' ORDER BY time ASC';
		} else {
		orderBy= ' ORDER BY time DESC';
		}
		showData();
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
		doneData();
		// showData(obj);
	    break;
	  case 'delete':
		deleteData();
		// showData(obj);
	    break;
	  case 'sort':
		sortData();
		// showData(obj);
	    break;
	   default: 
	   showData();
	}