const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const authroutes = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const blogcatRouter = require("./routes/blogcatRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const cors = require('cors');

const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));    // use to see the details of api request
app.use(express.json());   // this is for body parsing we can also usebodyparser for that 
app.use(cookieParser());   // this is for cookie parsing 


// database connection
const dbconnect = require("./config/dbconnect");
dbconnect();


// mounting of the routes
app.use("/api/user",authroutes);
app.use("/api/product", productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/category",categoryRouter);
app.use("/api/blogcategory",blogcatRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/color",colorRouter);
app.use("/api/enquiry",enqRouter);


// default route
app.get("/",(req,res) => {
    res.send(`<h1>Hello From Server Side</h1>`);
});


// Listening the app on port 5000 
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`App Is Running on the port ${PORT}`);
});