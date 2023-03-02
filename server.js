const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

const connection = mysql.createConnection({
  host: '127.0.0.1:3306',
  user: 'root',
  password: '',
  database: 'ygm'
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  connection.connect((err) => {
    if (err) {
      res.send("Database Connection Error!");
      return;
    }

    res.send("Database Connected!");
  })
  // res.send("I am live.");

  connection.end((err) => {
    if (err) {
      res.send("Connection Closing Error!");
      return;
    }

    res.send("Connection Closed!");
  });
});

app.post('/data', (req, res) => {
  // const { fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason } = req.body;
  const fullName = req.body.fullName;
  const presentOrLeave = req.body.presentOrLeave;
  const halfLeave = req.body.halfLeave;
  const fullLeave = req.body.fullLeave;
  const workDone = req.body.workDone;
  const leaveReason = req.body.leaveReason;

  connection.connect((err) => {
    if (err) {
      res.send("Database Connection Error!");
      return;
    }

    res.send("Database Connected!");
  })

  const sql = `INSERT INTO employee (fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason];


  connection.query(sql, values, (error, result) => {
    if (error) {
      res.send("Query Error!");
      return;
    }

    res.send("Success!");
  });


  connection.end((err) => {
    if (err) {
      res.send("Connection Closing Error!");
      return;
    }

    res.send("Connection Closed!");
  });

});

app.listen(port, () => {
  console.log('Server is listening on port 3000!');
});
