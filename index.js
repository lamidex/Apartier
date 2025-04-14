const express = require('express');
const { connectDB } = require('./config/db.js');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
require('./config/passport.setup');
require('dotenv').config();


const authRoutes = require('./routes/auth.routes');
const apartmentRoutes = require('./routes/apartment.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('views'));


app.use('/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/bookings', bookingRoutes);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});