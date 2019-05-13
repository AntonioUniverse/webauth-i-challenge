const express = require('express');
const helmet = require('helmet');

const bcrypt = require('bcryptjs');

const Users = require('./user-model');

const server = express();

server.use(helmet());
server.use(express.json());


server.get('/api/user', restricted, (req, res, next) => {
    Users.find()
    .then( user => {
        res.status(200).json(user)
    })
    .catch( error =>{
        res.status(500).json( error)
    })
})

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash =bcrypt.hashSync(user.password,10);
    user.password = hash
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
       
       if(user && bcrypt.compareSync(password, user.password)) {
         res.status(200).json({ message: `Welcome ${user.username}!`})
       } else {
         
         res.status(401).json({ message: 'Try Again, password is incorrect'});
       }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });


  function restricted(req, res, next) {

  
    const { username, password } = req.headers;
  
    if (username && password) {
      Users.findBy({ username })
        .first()
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
            next();
          } else {
            res.status(401).json({ message: 'Invalid credentials!'})
          }
        })
        .catch(error => {
          res.status(500).json({ message: 'Unexpected error!' })
        })
    } else {
      res.status(400).json({ message: 'Incomplete credentials provided!' });
    }
  }


  const port = process.env.PORT || 6000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));