const {client} = require("./config");

module.exports = function(id, time) {
  const table = "workout";

  const queryText = `UPDATE ${table} SET status='X', time=${time} WHERE id=${id};`;

  client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Query been added.");
    }
  });
};


