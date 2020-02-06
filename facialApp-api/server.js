const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
  });


const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.get('/',(req,res)=>{
    res.send('works !');
})

app.post('/signin',(req, res)=>{
    const {email, password} = req.body
    db.select('email','hash').where('email','=',email).from('login')
    .then(data => {
        const isValid = bcrypt.compareSync(password,data[0].hash);
        if (isValid){
            return db.select('*').from('users')
            .where('email','=',email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }
        else {
            res.status(400).json('wrong credntials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
    
})

app.post('/register',(req, res)=>{
    let exist = false;
    const {email, name, password} = req.body
    db.select('*')
    .from("users")
    .where("name", name)
    .andWhere("email", email)
    .then (userslist =>{
        if (userslist.length === 0){
           exist = false;
        }
    })
    if (!exist){
        const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(()=>res.json('user exists'))
    }
      
    
})

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    db.select('*').where('id',id).from('users')
    .then(user=> {
        if (user.length) {
       res.json(user[0])
    }
    else {
        res.status(400).json('NOT FOUND')
    }
    })
})

app.put('/image', (req,res)=>{
    const {id} = req.body;
    return db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json(err))    
})

var PORT = process.env.PORT || 3000
app.listen(PORT , ()=>{
    console.log("app running on port " , PORT)
});