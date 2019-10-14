const {client} = require("./config");

module.exports = function() {
  const table = "workout";

  const queryText = `SELECT * FROM ${table}`;

  client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // iterate through all of your results:
      let avgTime = 0;
      let avgDist = 0;
      let count = 0;
      for ( let i=0; i<res.rows.length; i++ ) {
        const time = res.rows[i].time === null ? "" : ` - ${res.rows[i].time}`;
        if (res.rows[i].time !== null) {
          avgTime += parseFloat(res.rows[i].time);
          avgDist += parseFloat(res.rows[i].distance);
          count += 1;
        }
        const speed = time !== "" ?
          ` - ${(parseFloat(res.rows[i].distance) / parseFloat(res.rows[i].time)).toFixed(2)} m / km` : "";
        console.log(`${res.rows[i].id}. [${res.rows[i].status}] - ${res.rows[i].distance} - ${res.rows[i].name}${time}${speed}`);
      }
      console.log(`Average run time: ${(avgTime/count).toFixed(2)} min`);
      console.log(`Average distance: ${(avgDist/count).toFixed(2)} km`);
      console.log(`Rating: ${getRatings((avgDist/count)/(avgTime/count))}`);
    }
  });
};

function getRatings(speed) {
  if (speed < 5) return "olympic record!!";
  else if (speed < 10) return "fast";
  else return "slow";
}
