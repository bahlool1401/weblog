const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/blog_db",{
            useNewUrlParser:false,
            useUnifiedTopology:false,
            // useFindAndModify:true
        });
        console.log(`mongo connected :${conn.connection.host}`);
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;





