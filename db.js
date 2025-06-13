const mongoose=require("mongoose");
const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://mongotut:mongo124@cluster0.k7ehn.mongodb.net/Pass?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
};
module.exports = dbConnect;