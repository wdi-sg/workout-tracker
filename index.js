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
            console.log(`${id}. ${title} - ${completion} - ${distance} - ${time} min - ${pace} min/km`)
        }
    }
}

const averageFunc = (unit, argument) =>{
    let queryText = `SELECT ${argument} FROM workout`;
    client.query(queryText, (err,result)=>{
        if(err){
            console.log("query error average function", err.message);
        } else {
            let total = 0;
            let num = 0
            for(var i = 0; i < result.rows.length; i++){
                if(result.rows[i][`${argument}`] !== null){
                    num++;
                    total += parseInt(result.rows[i][`${argument}`]);
                }
            }
            let average = total / num;
            console.log(`Average ${argument}: ${average} ${unit}`);
        }
    })
}

//When client connects, do whatever.
client.connect((err)=>{
    //Shows error message if there is any
    if(err){
        console.log("Error!", err.message);
    }

    let action = process.argv[2];
    if(action === undefined){
        console.log("Choose: add, view, complete, average, sort");
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
                    let res = result.rows[0];
                    let title = res.title;
                    let distance = res.distance;
                    let id = res.id;
                    console.log(`New to do added: ${id}. ${title} - ${distance} km`);
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
                    pace = time / distance ;
                    let completion = '[x]';
                    let arr = [completion,time,pace,id];
                    let queryText2 = `UPDATE workout SET completion=$1, time=$2, pace=$3 WHERE id=$4 RETURNING *`;
                    client.query(queryText2, arr, (err,result)=>{
                        if (err) {
                            console.log("query error view 3", err.message);
                        } else {
                            viewLoop(result);
                        }
                    })
                }
            })
        }
    } else if (action === "average"){
        let argument = process.argv[3];
        if (argument === undefined){
            console.log("Please key in the following format: average pace/distance");
        } else if(argument === "distance"){
            averageFunc("km", argument)
        } else if(argument === "pace"){
            averageFunc("mins/km", argument)
        }
    } else if (action === "sort"){
        let sortBy = process.argv[3];
        let argument = process.argv[4];
        if (sortBy === undefined || argument === undefined){
            console.log("Please key in the following format: sort ASC/DESC distance/time/pace");
        } else if (sortBy === "ASC" || sortBy === "DESC") {
            let queryText= `SELECT * FROM workout ORDER BY ${argument} ${sortBy}`;
            client.query(queryText, (err, result)=>{
                if (err) {
                    console.log("query error view 3", err.message);
                } else {
                    viewLoop(result);
                }
            })
        }
    } else if (action === "delete"){
        let id = process.argv[3];
        let queryText = `DELETE FROM workout where id=${id}`;
        if (id === undefined){
            console.log("Please key in the following format: delete id-number");
        } else {
            client.query(queryText, (err,result)=>{
                if (err) {
                    console.log("query error view 3", err.message);
                } else {
                    if(result.rowCount === 0){
                        console.log(`Id ${id} does not exist!`);
                    } else {
                        console.log(`Id ${id} has been deleted!`);
                    }
                }
            })
        }
    } else if (action === "find"){
        let argument = process.argv[3];
        let by = process.argv[4];
        let value = parseInt(process.argv[5]);
        // let arr = [argument, compare, value];
        let queryText;
        if(by === "above"){
            queryText = `SELECT * FROM workout WHERE ${argument} > ${value}`;
        } else if (by === "below"){
            queryText = `SELECT * FROM workout WHERE ${argument} < ${value}`;
        }

        if (argument === undefined || by === undefined || value === undefined){
            console.log("Please key in the following format: find pace/time/distance above/below integer");
        } else {
            console.log("Else")
            console.log(queryText)
            client.query(queryText,(err,result)=>{
                viewLoop(result);
            })
        }


    }


    // endConnection();
});