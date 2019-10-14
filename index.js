//Declare constant pg as dependency pg (postgres)
const pg = require('pg');
//Declare constant config as object with details of configuration
const config = {
    user: 'eden',
    host: '127.0.0.1',
    database: 'eden',
    port: 5432,
};
//Pass into postgres using config as argument. Store that as client.
const client = new pg.Client(config);

//Declare endConnection as a function to end connection
const endConnection = ()=>{
    client.end(err => {
      console.log('client has disconnected')
      if (err) {
        console.log('error during disconnection', err.stack)
      }
    })
};

//When client connects, do whatever.
client.connect((err)=>{
    //Shows error message if there is any
    if(err){
        console.log("Error!", err.message);
    }

    let action = process.argv[2];
    if(action === undefined){
        console.log("Choose: add, view");
    }
    console.log("Selected action: "+action);

    if(action === "add"){
        let title = process.argv[3];
        let distance = process.argv[4];
        let completetion = '[ ]';
        let arr = [title,distance,completetion];
        let queryText = `INSERT INTO workout (title,distance,completetion) VALUES ($1,$2,$3) RETURNING *`;
        if(title === undefined){
            console.log("Please key in the following format: add title distance");
        } else {
            client.query(queryText, arr, (err, result)=>{
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("New to do added: ", result.rows);
                }
            })
        }
    }

    endConnection();
});