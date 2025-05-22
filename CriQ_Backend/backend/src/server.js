
const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet');
const path = require('path')

require('./cron/dailyNewsJob');

require('dotenv').config();
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./configs/database');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes')
const movieNewsRoutes= require('./routes/movienewsRoutes');

const categoryRoutes=require('./routes/categoryRoute')
const subcategoryRoutes=require('./routes/subcategoryRoute')
const quizRoutes=require('./routes/quizRoutes')
const homeRoutes = require("./routes/homeRoutes");
const reviewRoutes = require('./routes/reviewRoutes');
const bannerRoutes=require('./routes/bannerRoutes')

const GameRoutes=require('./routes/GameRoutes')
const titleRoutes=require('./routes/titleRoutes')
const sectionRoutes=require('./routes/sectionRoutes')
const movieDashboardRoutes=require('./routes/movieDashboardRoutes')
const userQuizRoutes = require('./routes/userQuizRoutes');
const s3Routes = require('./routes/s3Routes'); // Import the upload routes

// require('./utils/scheduleOtp') //Periodically clear expired OTP records from the database to avoid bloating the collection   

const port = process.env.PORT || 6789;
// Set up HTTP server
connectDB();

// app.use((req,res,next)=>{ 
 
//     console.log(`${req.method} ${req.url}`);
//     next();
// })
// Middlewares
app.use(cors({ origin: "*" }));

//  Serve static files with proper headers
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); 
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Type"); 
    }
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
    contentSecurityPolicy: false
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads',express.static('uploads')) 

// const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', adminRoutes);
app.use('/user', userRoutes)
app.use("/api", bannerRoutes); 
app.use('/movienews', movieNewsRoutes);

app.use('/categories', categoryRoutes);
app.use('/subcategories', subcategoryRoutes);
app.use('/review', reviewRoutes)
app.use('/quizzes', quizRoutes);
app.use('/home', homeRoutes);

app.use('/game',GameRoutes)
app.use('/title',titleRoutes)
app.use('/section',sectionRoutes)
app.use('/reviewDashboard',movieDashboardRoutes)
app.use('/quiz', userQuizRoutes);
app.use("/", s3Routes);



// Error Handling Middleware
app.use(errorHandler);

app.listen(port, () => { 
    console.log(`Server running on http://localhost:${port}`)
});
app.get('/test', (req, res) => {
    res.send('Server is up and running!');
});


