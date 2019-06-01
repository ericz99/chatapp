const mongoose = require('mongoose');

module.exports = async function (mongoURI, obj = {}) {
    await mongoose
        .connect(mongoURI, { ...obj, useCreateIndex: true, useNewUrlParser: true })
        .then(console.log('Successfully connected to DB'))
        .catch(e => console.log(e));
}