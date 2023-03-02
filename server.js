const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ygm'
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/home', (req, res) => {

  connection.connect((err) => {
    if (err) {
      res.send("Connection Error!");
      return;
    }
  });

  const query = `SELECT * FROM employee`;

  connection.query(query, (err, results) => {
    if (err) {
      res.send("Query Error!");
    }

    res.render('home.ejs', { data: results });
  });

  connection.end((err) => {
    if (err) {
      res.send("Connection Closing Error!");
      return;
    }

    res.send("Connection Closed!");
  });

});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;


  connection.connect((err) => {
    if (err) {
      res.send("Connection Error!");
      return;
    }
  });

  const query = `SELECT * FROM admins WHERE username = ? AND password = ?`;
  const values = [username, password];

  connection.query(query, values, (err, results) => {
    if (err) {
      res.send("Query Error!");
    }
    if (results.length > 0) {
      res.redirect('/home');
    } else {
      res.send("Invalid username or password!");
    }
  });

  connection.end((err) => {
    if (err) {
      res.send("Connection Closing Error!");
      return;
    }

    res.send("Connection Closed!");
  });

});

app.post('/submitData', (req, res) => {
  // const { fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason } = req.body;
  const fullName = req.body.fullName;
  const presentOrLeave = req.body.presentOrLeave;
  const halfLeave = req.body.halfLeave;
  const fullLeave = req.body.fullLeave;
  const workDone = req.body.workDone;
  const leaveReason = req.body.leaveReason;
  const createdAt = req.body.createdAt;

  connection.connect((err) => {
    if (err) {
      res.send("Database Connection Error!");
      return;
    }

    res.send("Database Connected!");
  });

  const sql = `INSERT INTO employee (fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason, createdAt];


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
