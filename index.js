const pg = require('pg');

const configs = {
user: 'home',
host: '127.0.0.1',
database: 'testdb',
port: 5432,
};

const client = new pg.Client(configs);

client.connect((err) => {

      if( err ){
        console.log( "error", err.message );
      }

      let complete = false;
      let checkOff;
      if (complete === true){
        checkOff = "[x]"
      } else {
        checkOff = "[ ]"
      }
      let distance = process.argv[2];
      let name = process.argv[3];

      const values = [checkOff, distance, name]

    const queryText = 'INSERT INTO workouts(complete,distance,name) VALUES ($1, $2,$3) RETURNING *';
    client.query(queryText, values, (err,res)=>{
        if (err){
            console.log("query error", err.message);
            } else {
              // iterate through all of your results:

                console.log("added workout: ", `${res.rows[0].id}.`, `${res.rows[0].complete} - `, `${res.rows[0].distance}km - `, res.rows[0].name);
        }

    })


    const text = 'SELECT * FROM workouts'
      client.query(text, (err,res)=>{
           if (err) {
          console.log("query error", err.message);
        } else {
            for (let i=0; i<res.rows.length; i++){
          console.log(`${res.rows[i].id}.`, `${res.rows[i].complete} - `, `${res.rows[i].distance}km - `, res.rows[i].name);
        }
      }


    });
})