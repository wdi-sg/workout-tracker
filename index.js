const pg = require('pg');

const configs = {
user: 'SYNG',
host: '127.0.0.1',
database: 'workouts',
port: 5432,
};

const client = new pg.Client(configs);

console.log("     ***** WORKOUT_TRACKER *****.     ");
console.log("Instructions:");
//console.log("LIST - show workouts")
console.log("ADD  - \'add\' distance name");
console.log("COMPLETE - \'complete\' id time(hhmmss)");
console.log("---------------------------------------");

const list = function() {
      let queryList = 'SELECT * FROM workout';

      client.query(queryList, (err, res) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            const list = res.rows.map( row => {
                let id = row.id;
                let distance = row.distance;
                let name = row.name;
                let time = row.time;
                if (time === null) {
                    console.log (`${id}. [ ] - ${distance}km - ${name}`);
                } else {
                    console.log (`${id}. [x] - ${distance}km - ${name} - ${time}`);
                }
            })
        }
        //endConnection();
        // if terminate connection here,
        // cannot continue further commands
      });
}
list();

const whenConnected = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  let action = process.argv[2]

  switch (action) {

    // case 'list':
    //   let queryList = 'SELECT * FROM workout';

    //   client.query(queryList, (err, res) => {
    //     if (err) {
    //       console.log("query error", err.message);
    //     } else {
    //         const list = res.rows.map( row => {
    //             let id = row.id;
    //             let distance = row.distance;
    //             let name = row.name;
    //             console.log (`${id}. ${distance}km - ${name}`);
    //         })
    //     }
    //     endConnection();
    //   });

    //   break;


    case 'add':
        let distance = process.argv[3];
        let name = "";
        for ( let i=4; i<process.argv.length; i++ ) {
            name += process.argv[i] + " ";
        };
        let addValues = [distance, name];

        let queryInsert = 'INSERT INTO workout (distance, name) VALUES ($1, $2) RETURNING *';
        client.query(queryInsert, addValues, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              console.log("Inserting: Distance-" + distance + " Name-" + name);
            }
            endConnection();
        });
        break;

    case 'complete':
        let id = process.argv[3];
        let time = process.argv[4];
        let completeValues = [id, time];

        let queryUpdate = 'UPDATE workout SET time=$2 WHERE id=$1';
        client.query(queryUpdate, completeValues, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("Completed workout " + id + " in " + time);
            }
            endConnection();
        })
        break;

  }



}

client.connect(whenConnected);

const endConnection = () => {
    client.end(err => {
      console.log('Command completed')
      if (err) {
        console.log('error during disconnection', err.stack)
      }
    })
};