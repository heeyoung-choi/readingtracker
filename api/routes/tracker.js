var express = require('express');
var app = express.Router();
const bp = require('body-parser');
var mysql      = require('mysql');
let getdate = () => {
    let cur = new Date()
    return `${cur.getFullYear()}-${add0(cur.getMonth() + 1)}-${add0(cur.getDate())}`
}
let add0 = (item) => item >= 10 ? item.toString() : '0' + item.toString()
const { response } = require('express');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'roCinante3',
  database : 'readingtracker',
  multipleStatements: true
});
app.use(bp.urlencoded({extended: false}))
app.use(bp.json())
connection.connect();
app.get('/data', (req, res) => {
    connection.query(`select * from book order by id; select * from readingtrack;select sum(pageread) as todayread from readingtrack where
    readdate = '${getdate()}'; select readingtrack.id, sum(progress)+ initprog as progress from readingtrack 
    join initial 
    on readingtrack.id = initial.id
    group by id order by id`, function (error, results, fields) {
        if (error) throw error;
        // console.log(results[2])
        res.send(results)
        res.end()
    });  
})

app.post('/createBook',(request,response) => {
    connection.query(`insert into book (name, numofp) values ('${request.body.name}', ${request.body.numofp})`, (err, res, f) => {
        if (err) throw err;
    })
    console.log('request body:')
    console.log(request.body)
    response.end(JSON.stringify(request.body))
    });
app.post('/createTracker', (req, res) => {
    
    console.log(req.body)
    connection.query(`insert into readingtrack (id) values (${req.body.id})`, 
    (err, res, f) => {
        if (err) throw err;
    })
    res.end('request received')
})
app.put('/notreread', (req, res) =>{
    console.log(req.body)
    connection.query(` update readingtrack as a
    inner join readingtrack as b 
    on a.id = b.id and a.readdate = b.readdate 
    set a.progress = b.progress + 1, a.pageread = b.pageread + 1
    where a.id = ${req.body.id} and a.readdate = "${req.body.readdate}";`,
    (err, res, f) => {
        if (err) throw err;
    })
    res.end('receive req')
})
app.put('/reread', (req, res) =>{
    console.log(req.body)
    connection.query(` update readingtrack as a
    inner join readingtrack as b 
    on a.id = b.id and a.readdate = b.readdate 
    set a.pageread = b.pageread + 1
    where a.id = ${req.body.id} and a.readdate = "${req.body.readdate}";`,
    (err, res, f) => {
        if (err) throw err;
    })
    res.end('receive req')
})
module.exports = app;
