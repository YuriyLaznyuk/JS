const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
const app = express();
const rootDir = path.resolve('dist');
const jsonParser = express.json();
const rootFiles = path.resolve('files');
const fileUsers = path.join(rootFiles, "users.json");
const fileUsersStat = path.join(rootFiles, "users_statistic.json");
let PORT = process.env.PORT || 3535;
const reg = /^\/(statistics|user-page\/d)$/;
let users;
let usersStatistic;
let dbClient;
const urlLocal = "mongodb://localhost:27017/";
const urlMongo = "mongodb+srv://backend:backend123@cluster0.xvkzn.mongodb.net/new_base?retryWrites=true&w=majority";
// const mongoClient = new MongoClient(urlLocal, {useUnifiedTopology: true});
const mongoClient = new MongoClient(urlMongo, {useUnifiedTopology: true});

fs.readFile(fileUsers, 'utf8', function (err, data) {
    if (err) {
        throw err;
    } else
        users = JSON.parse(data);
});

fs.readFile(fileUsersStat, 'utf8', function (err, data) {
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
    app.locals = client.db('usersdb');
});

app.use(express.static(path.join(rootDir, "/")));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, "index.html"));
});

app.get(reg, (req, res) => {
    res.sendFile(path.join(rootDir, "index.html"));
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
    collection.insertMany(sumUsers, (err, result) => {
        if (err) {
            console.log(err);
        }

    });
    const collectionStatistic = req.app.locals.collection('statistic');
    collectionStatistic.insertMany(usersStatistic, (err, result) => {
        if (err) {
            console.log(err);
        }
    });
    res.json({message: users.length});
});

app.get("/api/total/:number", (req, res) => {
    const number = req.params.number;
    const col = process.env.LIMIT;
    const minId = (number - 1) * col + 1;
    const maxId = number * col;

    const collection = req.app.locals.collection('users1');
    collection.find({id: {$gte: minId, $lte: maxId}}).limit(50).toArray((err, result) => {
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

    collection.find({user_id: id}).toArray((err, result) => {
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

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});

app.listen(PORT, () => console.log('server_mongo PORT: '
    + PORT + ' LIMIT ' + process.env.LIMIT));