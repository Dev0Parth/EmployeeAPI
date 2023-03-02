const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1:3306',
  user: 'root',
  password: '',
  database: 'ygm'
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.send("Database connection error!");
    } else {
      res.send("Database connected!");
    }
  })
  res.send("Hello, I am live");
});

app.post('/data', (req, res) => {
  const { fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring database connection: ', err);
      res.sendStatus(500);
      return;
    }

    const sql = `INSERT INTO employee (fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason];

    connection.query(sql, values, (err, result) => {
      connection.release();

      if (err) {
        console.error('Error inserting data into database:', err);
        res.send("Data Not Inserted!");
        return;
      }

      res.send("Data Inserted!");
    });
  });
});

app.listen(port, () => {
  console.log('Server is listening on port 3000!');
});
