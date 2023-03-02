const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');

const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ygm'
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: true
}));

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/home', isLoggedIn, (req, res) => {

  const query = `SELECT * FROM employee`;

  connection.query(query, (err, results) => {
    if (err) {
      res.send("Query Error!");
      return;
    }

    res.render('home', { data: results, user: req.session.user });
  });

});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM admins WHERE username = ? AND password = ?`;
  const values = [username, password];

  connection.query(query, values, (err, results) => {
    if (err) {
      res.send("Query Error!");
      return;
    }
    if (results.length > 0) {
      req.session.user = username;
      res.redirect('/home');
    } else {
      res.send("Invalid username or password!");
      return;
    }
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


  const sql = `INSERT INTO employee (fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [fullName, presentOrLeave, halfLeave, fullLeave, workDone, leaveReason, createdAt];


  connection.query(sql, values, (error, result) => {
    if (error) {
      res.send("Query Error!");
      return;
    }

    res.send("Success!");
  });

});

app.listen(port, () => {
  console.log('Server is listening on port 3000!');
});
