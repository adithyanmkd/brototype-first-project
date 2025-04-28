import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import MongoStore from 'connect-mongo';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import cors from 'cors';

// import config modules
import connectDB from './config/database.js'; // database config

//importing routes
import userRouter from './routes/user/index.js';
import adminRouter from './routes/admin/index.js';

// middleware
import errorHandler from './middlewares/common/errorHandler.js';

const app = express();

//fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/user-layout');

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions', // Collection name in MongoDB
      ttl: 24 * 60 * 60, // Session expires in 24 hours
    }),
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevents client-side JavaScript from accessing the session cookie
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiry in 24 hours
    },
  })
);

app.use(cors());

// cache management
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.json()); // Enables JSON parsing (for APIs)
app.use(express.urlencoded({ extended: true })); // Enables parsing of form data
app.use(expressLayouts); // Use express-ejs-layouts
app.use(express.static(path.join(__dirname, 'public'))); //serve static files (images, js, CSS)

//router
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catching 404 and sent to error handler
app.use((req, res, next) => {
  let error = new Error('Page not found');
  error.status = 404;
  next(error);
});

// using error handler
app.use(errorHandler);

connectDB(); // connect mongoDB

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on ${PORT}`));
