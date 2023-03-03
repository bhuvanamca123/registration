const express= require('express');
require("dotenv").config();
const session = require('express-session');
const bodyParser = require('body-parser');
const redis = require('redis');
 
  
 
 
 
const app=express();
  
const cors=require("cors");
  
app.use(cors());
  
  
 
const redisStore = require('connect-redis')(session);
  
  
  
  
  
const PORT= process.env.APP_PORT;
const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2
 
const REDIS_PORT= process.env.REDIS_PORT;
 
 
//create the redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: REDIS_PORT
 })
   
  
 
const  sessionStore = new redisStore({ client: redisClient });
  
   
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
  
  
  
  
app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.use(bodyParser.json())
  
  
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}))
  
 
 
  
    
  
app.get('/', (req, res)=>{
    const { email } = req.session
    res.send(`
    <h1> Welcome!</h1>
     ${email ? `<a href = '/home'> Home </a>
    <form method='post' action='/logout'>
    <button>Logout</button>
    </form>` : `<a href = '/login'> Login </a>
   <a href = '/register'> Register </a>
`}
    `)
})
 
 
app.get('/home',  (req,res)=>{
    const {email} =req.session
     if(email){
    try{
        redisClient.hgetall(email, function(err, obj){
         
        res.send(`
        <h1>Home</h1>
        <a href='/'>Main</a>
        <ul>
        <li> Name: ${obj.first_name} </li>
        <li> Email:${obj.email} </li>
        </ul>
      
        `)
        })    
    } catch(e) {
        console.log(e);
        res.sendStatus(404);
    }
}
     
})
  
  
app.get('/login', (req,res)=>{
    res.send(`
    <h1>Login</h1>
    <form method='post' action='/login'>
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <a href='/register'>Register</a>
    `)
})
 
 
 
 
 
 
 
 app.get('/register', (req,res)=>{
    res.send(`
    <h1>Register</h1>
    <form method='post' action='/Register'>
    <input type='text' name='firstName' placeholder='First Name' required />
    <input type='text' name='lastName' placeholder='Last Name' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' placeholder='password' required/>
    <input type='submit' />
    </form>
    <a href='/login'>Login</a>
    `)
})
  
 
 
 
app.post('/login', (req, res, next)=>{
    try{ 
    const email = req.body.email;
    const password = req.body.password;
     
     
    redisClient.hgetall(email, function(err, obj){
    if(!obj){
        return res.send({
            message: "Invalid email"
        })
    }
    if(obj.password !== password){
        return res.send({
            message: "Invalid  password"
        })
    }
        
        req.session.email = obj.email;
         return res.redirect('/home');
     
});
         
    } catch(e){
        console.log(e);
    }
  
 
});
  
 
 
 
 
app.post('/register', (req, res, next)=>{
    try{
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
  
  
              if (!firstName || !lastName || !email || !password) {
                return res.sendStatus(400);
             }
  
              
              
  
             redisClient.hmset(email, 
                'first_name', firstName,
                'last_name', lastName,
                'email', email,
                'password', password,
              function(err, reply){
                if(err){
                  console.log(err);
                }
                console.log(reply);
                res.redirect('/register') ;
                 
              });
               
  
         
  
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
  
 
 
 
app.post('/logout',  (req, res)=>{
    req.session.destroy(err => {
        if(err){
            return res.redirect('/home')
        }
         
        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/login')
    })
  
})
  
 
 
app.listen(PORT, ()=>{console.log(`server is listening on ${PORT}`)});
