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
    console.log(action);
    endConnection();
});