const mongoose = require('mongoose');
const dotenv = require('dotenv');

// catch all the uncaught exceptions 
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION: Shutting down...')
    console.log(err.name, err.message);
    process.exit(1); // this won't, it will terminate all 
})

dotenv.config({
    path: './config.env'
});
const app = require('./app');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
    // mongoose.connect(process.env.DATABASE_LOCAL, {
    // remove below when use version 6.x
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log('db connection successful!'));

// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}... `);
});

// catch all unhandled rejection
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION: Shutting down...')
    console.log(err.name, err.message);
    server.close(() => {
        // give server time to finish all the requests that are pending or being handled
        process.exit(1); // this won't, it will terminate all 
    });
})


