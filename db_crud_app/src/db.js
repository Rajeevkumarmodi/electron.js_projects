const mariadb = require("mariadb");

async function dbConnection() {
  const pool = mariadb.createPool({
    host: "127.0.0.1",
    port: "3307",
    user: "root",
    password: "rajeev123",
    database: "posSystem",
  });

  const connect = await pool.getConnection();
  return connect;
}

module.exports = dbConnection;
