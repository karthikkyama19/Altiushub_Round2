const mongoose = require("mongoose");

const db =() => mongoose.connect(process.env.URL)
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

module.exports = db;