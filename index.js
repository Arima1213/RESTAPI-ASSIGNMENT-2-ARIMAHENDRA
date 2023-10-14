const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const teachersData = require('./teaches.json');
const usersData = require('./users.json');


const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = 'kuncijwt';

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersData.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Username dan Password salah, mohon coba lagi' });
  }else{
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
  }
});

function verifikasiToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
}

app.get('/get-all-data', verifikasiToken, (req, res) => {
  res.json(teachersData);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
