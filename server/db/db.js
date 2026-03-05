const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/cohort-tools";

mongoose.connect(MONGO_URI)
.then(() =>{
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});