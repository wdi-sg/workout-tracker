const {client} = require("./config");

module.exports = function(distance, name) {
  const table = "workout";

  const queryText = `INSERT INTO ${table} (distance, name, status) VALUES ($1, $2, $3) RETURNING id`;
  const values = [distance, name, " "];
  console.log(queryText);

  client.query(queryText, values, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Query been added.");
    }
  });
};

