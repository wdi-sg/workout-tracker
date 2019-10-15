const pg = require("pg");
const dateFormat = require('dateformat');
const configs = {
  user: "nathanaeltan",
  host: "127.0.0.1",
  database: "workouttracker",
  port: 5432
};

const client = new pg.Client(configs);


const whenQueryDone = (err, result) => {
    
   let display = result.rows.map(obj => {
       let box;
       if(obj.completed === null){
           box = '[]'
       } else if (obj.completed === true) {
           box = "[X]"
       }
       let paceUnit = " m/km"
       let dash = "-"
       let time;
       let pace 
       if(obj.time === null) {
           time = "";
           pace ="";
           paceUnit=""
           dash = ""
       } else {
           time = `- ${obj.time} mins -`
           pace=Math.round(obj["avgspeed"])   
       }
       return `${obj["id"]}. ${box} - ${obj.distance}km - ${obj.name} ${time} ${pace}${paceUnit}`

       
   })
//   console.log("results: ", result.rows);
  console.log("\n" + "********** WORKOUTS ********** \n\n" +  display.join("\n"))
};

const whenConnected = err => {
  if (err) {
    console.log("error INSIDE WHEN CONNECTED", err.message);
  }
  let command = process.argv[2];
//   ADD A WORKOUT TO THE TABLE
  if (command === "add") {
    let distance = process.argv[3];
    let name = process.argv[4];
    const now = new Date()
    let inputValues = [distance, name, dateFormat()];
    const text =
      "INSERT INTO workouts (distance, name, dateadded) VALUES ($1, $2, $3)";

    console.log("MY QUERYYYY: " + text);
    client.query(text, inputValues, whenQueryDone);

    // MARK A WORKOUT AS COMPLETE
  } else if(command === "complete"){
    let id = process.argv[3];
    let time = process.argv[4];
    let inputValues = [id, time];
    
    const text = "UPDATE workouts SET completed='true', time=$2, avgspeed=$2/distance WHERE id=$1 RETURNING *"
  

    console.log("MY QUERYYYY: " + text);
    client.query(text, inputValues, whenQueryDone);

    // PERMANENTLY DELETE A WORKOUT FROM THE TABLE
  } else if(command === "delete") {
    let id = process.argv[3];
    let inputValues = [id];
    const text = "DELETE from workouts WHERE id=$1"
    client.query(text, inputValues, whenQueryDone);

} else if(command === "clear"){
    const text = "TRUNCATE workouts RESTART IDENTITY"
    client.query(text, whenQueryDone);


} else {
    const text =
      "SELECT * FROM workouts ORDER BY id ASC;";

    console.log("MY QUERYYYY: " + text);
     
    client.query(text, whenQueryDone);
   
  }
 
};


client.connect(whenConnected);





