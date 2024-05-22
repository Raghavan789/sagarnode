
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'sagarnode'
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
 

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});


// Route to handle login form submission
app.post('/login', (req, res) => {  
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM logins WHERE email = ? AND password = ?';
    db.query(selectQuery, [email, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length === 0) {
            res.send('Invalid email or password');
        } else {
            const ac_id = result[0].ac_id;
            req.session.email = email;
            req.session.ac_id = ac_id;
            res.redirect('/dashboard');
        }
    });
});


app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const selectQuery = 'SELECT * FROM logins WHERE email = ?';
    const insertQuery = 'INSERT INTO logins (email, password) VALUES (?, ?)';
    db.query(selectQuery, [email], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            res.send('User already exists');
        } else {
            db.query(insertQuery, [email, password], (err, result) => {
                if (err) {
                    throw err;
                }
                console.log('User registered successfully');
                          
                res.send(`Registration successful.${email}.`);

            });
        }
    });

});

app.get('/dashboard', (req, res) => {
    const email = req.session.email; // Retrieve email from session
    const ac_id = req.session.ac_id; //retrieve ac_id 
    if (!email) {
        res.redirect('/'); // Redirect to login if session email is not set
    } else {
        // Render dashboard with email
        res.render('dashboard', { email,ac_id });
    }
});
