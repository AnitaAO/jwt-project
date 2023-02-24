require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//importing user context
const User = require('./model/user');
const auth = require('./middleware/auth');


const app = express();

app.use(express.json({ limit: '50mb'}));


//Register
app.post('/register', async (req, res) => {
    //register logic goes here
    try {
        const {first_name, last_name, email, password } = req.body;

        //validate user input
        if(!(first_name && last_name && email && password)){
            res.status(400).send('All input is required');
        }

        //check if user already exist
        //validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser){
            return res.status(409).send('User Already Exist. Please Login');
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        //create user in the database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        //create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: '2h'}
        );

        //save user token
        user.token = token;

        //return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    //register logic ends here
});

//Login
app.post('/login', async (req, res) => {
    //login logic goes here
    try {
        //get user input
        const { email, password } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send('All input is required');
        }

        //validate if user exist in our database
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))) {
            
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {expiresIn: '2hr'}
            );

            //save user token
            user.token = token;

            //user
            res.status(200).json(user);
        }
        res.status(400).send('Invalid Credentials');
    }catch (err) {
        console.log(err);
    }

    //login logic ends
});

//auth
app.post('/welcome', auth, (req, res) => {
    res.status(200).send('welcome');
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: 'false',
        message: 'Page not found',
        error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this sercer',
        },
    });
});

module.exports = app;