require('dotenv').config();
require('./config/database');
const express = require('express')

const app = express();

app.use(express.json());

//importing user context
const User = require('./model/user');

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
            { user_id: user_id, email },
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
app.post('/login', (req, res) => {
    //login logic goes here
    try {
        const { email, password } = res.body
    }
})

module.exports = app;