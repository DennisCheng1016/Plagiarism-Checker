require('dotenv').config();
require('express-async-errors');
// Express
const express = require('express');
const app = express();
// Database
const connectDB = require('./Config/connectMongo');
const { default: mongoose } = require('mongoose');

// Rest of packages
const fileUpload = require('express-fileupload');

// Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Routers
const authRouter = require('./routes/authRouter');
const fileRouter = require('./routes/fileRouter');
const checkerRouter = require('./routes/checkerRouter');
const resultRouter = require('./routes/resultRouter');
const subjectRouter = require('./routes/subjectRouter');
const assignmentRouter = require('./routes/assignmentRouter');
const bufferFileRouter = require('./routes/bufferFileRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

// Middlewares
const verifyAdmin = require('./middlewares/verifyAdmin').verifyAdmin;
const verifyToken = require('./middlewares/verifyToken').verifyToken;
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
//connect to database

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.set('trust proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
);

app.get('/', (req, res) => {
	res.send('SC-Quokka presents');
});

app.use('/auth', authRouter);
app.use(verifyToken);
app.use('/user', userRouter);
app.use('/file', fileRouter);
app.use('/check', checkerRouter);
app.use('/result', resultRouter);
app.use('/subject', subjectRouter);
app.use('/assignment', assignmentRouter);
app.use('/buffer', bufferFileRouter);
// app.use(verifyAdmin);
app.use('/admin', adminRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8888;
connectDB();
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(port, error => {
		if (!error)
			console.log(
				'Server is Successfully Running, and App is listening on port ' +
					port
			);
		else console.log("Error occurred, server can't start", error);
	});
});
