const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cors = require('cors')

var http = require("http")
var path = require("path")
var nodemailer = require("nodemailer");
const { text } = require("stream/consumers");



const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoURI = 'mongodb://0.0.0.0:27017/myapp';

mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const User = require('./models/user');

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// Register new user
app.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already exists' });
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    fullName: req.body.fullName,
                    phoneNumber:req.body.phoneNumber,
                    companyDesc:req.body.companyDesc,
                    brandName:req.body.brandName
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// User login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, username: user.username }; // Create JWT payload
                        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
                            res.json({ success: true, token: `Bearer ${token}` });
                        });
                    } else {
                        return res.status(400).json({ password: 'Incorrect password' });
                    }
                });
        });
});

// Protected route
app.get('/manufacturer', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});


// Define routes for different pages
app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/dashboard',passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('dashboard', { user: req.user });
  });
  
  app.get('/addproduct',passport.authenticate('jwt', { session: false }),(req, res) => {
    res.render('profile', { user: req.user });
  });

//-------------------------------------------------------------for seller

const Seller = require('./models/seller');

// Register new user
app.post('/sregister', (req, res) => {
    Seller.findOne({ sellercode: req.body.sellercode })
        .then(seller => {
            if (seller) {
                return res.status(400).json({ sellercode: 'seller already exists' });
            } else {
                const newUser = new Seller({
                    sellercode: req.body.sellercode,
                    semail: req.body.semail,
                    spassword: req.body.spassword,
                    sfullName: req.body.sfullName,
                    sphoneNumber:req.body.sphoneNumber
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.spassword, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.spassword = hash;
                        newUser.save()
                            .then(seller => res.json(seller))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// User login
app.post('/slogin', (req, res) => {
    const sellercode = req.body.sellercode;
    const spassword = req.body.spassword;

    Seller.findOne({ sellercode })
        .then(seller => {
            if (!seller) {
                return res.status(404).json({ sellercode: 'User not found' });
            }

            bcrypt.compare(spassword, seller.spassword)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: seller.id, username: seller.username }; // Create JWT payload
                        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
                            res.json({ success: true, token: `Bearer ${token}` });
                        });
                    } else {
                        return res.status(400).json({ spassword: 'Incorrect password' });
                    }
                });
        });
});





//-------------------------------------------------------




//Routing
app.post('/sendemail', (req, res) => {
    const to = req.body.to;
    const sellercode=req.body.sellercode;
    console.log(`Received email to: ${to,sellercode}`);
    
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jayeshgadhari60@gmail.com',
        pass: 'oeuvnjlnlxdmighn'
      }
    });
  
    var mailOptions = {
      from: '"Jayesh" <jayeshgadhari60@gmail.com>',
      to: to,
      subject: 'Registration Confirmation',
      
      text: `your seller code is: ${sellercode} using this register yourself http://localhost:3000/sellersignup.html`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email.');
        } else {
          console.log("Email Sent: " + info.response);
          res.status(200).send('Email sent successfully!');
        }
      });
    });
  











const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));