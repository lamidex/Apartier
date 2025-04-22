const express = require('express');
const { connectDB } = require('./config/db.js');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
require('./config/passport.setup');
require('dotenv').config();
const path = require('path');


const authRoutes = require('./routes/auth.routes');
const apartmentRoutes = require('./routes/apartment.routes');
const bookingRoutes = require('./routes/booking.routes');
const userRoutes = require('./routes/user.routes');



const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));


app.use(passport.initialize());
app.use(passport.session());





app.use('/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/login.html'));
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});