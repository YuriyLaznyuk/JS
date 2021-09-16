const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();
const rootDir = path.resolve('dist');
const rootFiles = path.resolve('files');
const fileUsers = path.join(rootFiles, 'users.json');
const fileUsersStat = path.join(rootFiles, 'users_statistic.json');
let PORT = process.env.PORT || 3535;
const reg = /^(\/|\/statistics|\/user-page\/\d)$/;
let users;
let usersStatistic;
let dbClient;
// const urlLocal = 'mongodb://localhost:27017/';
// const mongoClient = new MongoClient(urlLocal, {useUnifiedTopology: true});

const mongoClient = new MongoClient(process.env.URL_MONGO, { useUnifiedTopology: true });

fs.readFile(fileUsers, 'utf8', function(err, data) {
  if (err) {
    throw err;
  } else
    users = JSON.parse(data);
});

fs.readFile(fileUsersStat, 'utf8', function(err, data) {
  if (err) {
    throw err;
  } else
    usersStatistic = JSON.parse(data);
});

//connect
mongoClient.connect((err, client) => {

  if (err) {
    console.log(err);
  }
  dbClient = client;
  app.locals = client.db('usersdb');

  app.listen(PORT, () => console.log('server_mongo PORT: '
    + PORT + ' LIMIT ' + process.env.LIMIT));

});

app.use(express.static(rootDir));

app.get(reg, (req, res) => {
  res.sendFile(path.resolve('dist','index.html'));
});

app.get('/api/users', (req, res) => {

  const pushFilter = [];
  for (let i = 1; i < users.length + 1; i++) {
    pushFilter.push(usersStatistic.filter(item => item['user_id'] === i));
  }

  function getSum(field, arr) {
    let init = 0;
    return arr.reduce((acb, item) =>
      item[field] + acb, init);
  }

  const pushSum = [];
  pushFilter.forEach(elem => {
    pushSum.push({
      user_id: elem[0]['user_id'],
      sumViews: getSum('page_views', elem),
      sumClicks: getSum('clicks', elem)
    });
  });

  const sumUsers = [];
  for (let i = 0; i < users.length; i++) {
    sumUsers.push({
      ...users[i],
      sumViews: pushSum[i]['sumViews'],
      sumClicks: pushSum[i]['sumClicks']
    });
  }

  const collection = req.app.locals.collection('users1');
  const collectionStatistic = req.app.locals.collection('statistic');

  app.locals.collection('users1').count((err, date) => {
    if (date === 0) {
      collection.insertMany(sumUsers, (err, result) => {
        if (err) {
          console.log(err);
        }

      });

      console.log(`sizeUsers `, date);
    }

  });

  app.locals.collection('statistic').count((err, date) => {
    if (date === 0) {
      collectionStatistic.insertMany(usersStatistic, (err, result) => {
        if (err) {
          console.log(err);
        }
      });

    }
    console.log(`sizeStatistic `, date);
  });

  res.json({ message: users.length });

});

app.get('/api/total/:number', (req, res) => {
  const number = req.params.number;
  const col = process.env.LIMIT;
  const minId = (number - 1) * col + 1;
  const maxId = number * col;

  const collection = req.app.locals.collection('users1');
  collection.find({ id: { $gte: minId, $lte: maxId } }).limit(50).toArray((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  let set = new Set();
  let arr = [];
  let rez = [];
  const id = +req.params.id;
  const collection = req.app.locals.collection('statistic');

  collection.find({ user_id: id }).toArray((err, result) => {
    if (err) {
      console.log(err);
    } else {

      arr = [...result];
      arr.forEach(elem => set.add(elem.date));

      // console.log(set);
      const arrSet = [...set];
      for (let i = 0; i < arrSet.length; i++) {
        if (arr[i].date === arrSet[i]) {
          rez.push(arr[i]);
        }
      }

      // console.log(rez);
      res.send(rez);

    }
  });

});

app.use((req, res) => {
  res.status(404).sendFile(path.resolve('dist','error.html'));
});

process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});

