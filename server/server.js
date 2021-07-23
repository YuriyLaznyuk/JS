const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const rootDir = path.join(path.resolve(), 'dist');
// const rootDir = path.resolve('dist');

const rootDB = path.join(path.resolve(), 'db');
const rootFiles = path.join(path.resolve(), 'files');
const fileUsers = path.join(rootFiles, 'users.json');
const fileUsersStat = path.join(rootFiles, 'users_statistic.json');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
//async func
const contentUsers = fs.readFileSync(fileUsers, 'utf8');
const contentUsersStat = fs.readFileSync(fileUsersStat, 'utf8');
const users = JSON.parse(contentUsers);
const usersStatistic = JSON.parse(contentUsersStat);
let PORT = process.env.PORT || 8585;

let reg = /^\/(statistics|user-page\/\d)$/;
let db = new sqlite3.Database(path.join(rootDB, 'users-statistics.db'), sqlite3.OPEN_READWRITE,
    err => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the users-statistics database');
    });

app.use(express.static(rootDir + "/"));

app.get("/", (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get(reg, (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get("/api/users", (req, res) => {

    db.serialize(() => {

        let pushFilter = [];
        for (let i = 1; i < users.length + 1; i++) {
            pushFilter.push(usersStatistic.filter(itm => itm['user_id'] === i));
        }

//sum
        function getSum(inst, arr) {
            let init = 0;
            return arr.reduce((acb, item) =>
                item[inst] + acb, init);
        }

        let pushSum = [];
        pushFilter.forEach(elem => {
            pushSum.push({
                user_id: elem[0]['user_id'],
                sumViews: getSum('page_views', elem),
                sumClicks: getSum('clicks', elem)
            });
        });

        db.run(`CREATE TABLE IF NOT EXISTS users (
id INT ,
first_name VARCHAR (20),
last_name VARCHAR (20),
email VARCHAR (20),
gender VARCHAR (20),
ip_address VARCHAR (20),
sumViews INT ,
sumClicks INT 
)`);

        db.run(`CREATE TABLE IF NOT EXISTS users_statistic (
user_id INT ,
date VARCHAR (20),
page_views INT ,
clicks INT
)`);

        for (let i = 0; i < users.length; i++) {

            db.run(`INSERT INTO users ( id, first_name, last_name, email, gender, ip_address, sumViews, sumClicks )
VALUES (?,?,?,?,?,?,?,?)`, [users[i]['id'], users[i]['first_name'], users[i]['last_name'],
                users[i]['email'], users[i]['gender'], users[i]['ip_address'],
                pushSum[i]['sumViews'], pushSum[i]['sumClicks']]);
        }

        //users-statistic
        for (let i = 0; i < usersStatistic.length; i++) {
            db.run(`INSERT INTO users_statistic (user_id, date,page_views,clicks ) VALUES (?,?,?,?)`,
                [usersStatistic[i]['user_id'], usersStatistic[i]['date'],
                    usersStatistic[i]['page_views'], usersStatistic[i]['clicks']]);
        }

    });

// db.close();
    res.json({message: users.length});

});

app.get("/api/total/:number", (req, res) => {
    const number = req.params.number;
    const col = process.env.LIMIT;
    const minId = (number - 1) * col + 1;
    const maxId = number * col;

    let db = new sqlite3.Database(path.join(rootDB, 'users-statistics.db'), sqlite3.OPEN_READWRITE,
        err => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the users-statistics database');
        });

    db.serialize(() => {

        let sql9 = `SELECT * FROM USERS AS U WHERE U.ID>=${minId} AND U.ID<=${maxId} LIMIT 50`;

        db.all(sql9, (err, row) => {
            if (err) {
                console.log(err);
            } else
                res.send(row);
            // console.log(row);
        });

    });
    // db.close();
});

app.get('/api/users/:id', (req, res) => {
    let db = new sqlite3.Database(path.join(rootDB, 'users-statistics.db'), sqlite3.OPEN_READWRITE,
        err => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the users-statistics database');
        });
    const id = req.params.id;
    db.serialize(() => {
        let sql = `SELECT DISTINCT date, page_views , clicks FROM users_statistic AS US WHERE US.user_id=${id}`;
        db.all(sql, (err, row) => {
            if (err) {
                console.log(err);
            } else {
                res.send(row);

            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`server port ${PORT}`);
    console.log(process.env.LIMIT);

});














