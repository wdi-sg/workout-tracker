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

//Prevent writing code for view all and view specific id;
const viewLoop = (result) =>{
    for(var i = 0; i < result.rows.length; i++){
        let obj = result.rows[i];
        let id = obj["id"];
        let distance = obj["distance"] + " km";
        let title = obj["title"];
        let time = obj["time"];
        let completion = obj["completion"];
        let pace = obj["pace"];
        if(completion === "[ ]"){
            console.log(`${id}. ${title} - ${completion} - ${distance}`)
        } else {
            console.log(`${id}. ${title} - ${completion} - ${distance} - ${time} - ${pace}`)
        }
    }
}

//When client connects, do whatever.
client.connect((err)=>{
    //Shows error message if there is any
    if(err){
        console.log("Error!", err.message);
    }

    let action = process.argv[2];
    if(action === undefined){
        console.log("Choose: add, view, complete");
    }
    console.log("Selected action: "+action);

    //If action is add, insert basic informations.
    if(action === "add"){
        let title = process.argv[3];
        let distance = process.argv[4];
        let completion = '[ ]';
        let arr = [title,distance,completion];
        let queryText = `INSERT INTO workout (title,distance,completion) VALUES ($1,$2,$3) RETURNING *`;
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
    } else if (action === "view"){
        let selection = process.argv[3];
        if(selection === undefined){
            console.log("Please key in the following format: view all/id-number")
        } else if (selection === "all"){
            let queryText = "SELECT * FROM workout";
            client.query(queryText, (err, result)=>{
                if (err) {
                    console.log("query error view", err.message);
                } else {
                    viewLoop(result);
                }
            });
        } else {
            let queryText = `SELECT * FROM workout where id = ${selection}`
            client.query(queryText, (err, result)=>{
                if (err) {
                    console.log("query error view 2", err.message);
                } else {
                    viewLoop(result);
                }
            })
        }
    } else if (action === "complete"){
        let id = process.argv[3];
        let time = process.argv[4];
        let pace;
        if(id === undefined || time === undefined){
            console.log("Please key in the following format: complete id-number time");
        } else {
            let queryText = `SELECT distance FROM workout where id = ${id}`;
            client.query(queryText, (err,result)=>{
                if (err) {
                    console.log("query error view 2", err.message);
                } else {
                    distance = result.rows[0]["distance"]
                    console.log("Time: ", time)
                    pace = time / distance;
                    let completion = '[x]';
                    let arr = [completion,time,pace,id];
                    let queryText2 = `UPDATE workout SET completion=$1, time=$2, pace=$3 WHERE id=$4 RETURNING *`;
                    client.query(queryText2, arr, (err,result)=>{
                        if (err) {
                            console.log("query error view 3", err.message);
                        } else {
                            console.log(result.rows);
                        }
                    })
                }
            })

            // client.query()
            // let queryText = `UPDATE workout SET completion=[x] time=${time}`
        }
    }


    // endConnection();
});