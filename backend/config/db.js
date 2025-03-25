const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        
        // waiting connection
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(` MongoDB connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(` Connextion error to MongoDB : ${error.message}`);
        process.exit(1); // exit app
    }
};

module.exports = connectDB;
