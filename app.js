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

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Routers
const authRouter = require('./routes/authRouter');
const checkerRouter = require('./routes/checkerRouter');
const resultRouter = require('./routes/resultRouter');
const subjectRouter = require('./routes/subjectRouter');
const assignmentRouter = require('./routes/assignmentRouter');
const datasetRouter = require('./routes/datasetRouter');
const bufferFileRouter = require('./routes/bufferFileRouter');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const datasetFileRouter = require('./routes/datasetFileRouter');

// Middlewares
const verifyAdmin = require('./middlewares/verifyAdmin').verifyAdmin;
const verifyToken = require('./middlewares/verifyToken').verifyToken;
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
//connect to database

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.set('trust proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 1000, // limit each IP to 100 requests per windowMs
	})
);

app.get('/', (req, res) => {
	res.send(
		'<h1>SC-Quokka Plagiarism Checker API</h1><a href="/api-docs">Documentation</a>'
	);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/auth', authRouter);
app.use(verifyToken);
app.use('/user', userRouter);
app.use('/check', checkerRouter);
app.use('/result', resultRouter);
app.use('/subject', subjectRouter);
app.use('/assignment', assignmentRouter);
app.use('/dataset', datasetRouter);
app.use('/buffer', bufferFileRouter);
app.use('/datasetFile', datasetFileRouter);
// app.use(verifyAdmin);
app.use('/admin', verifyAdmin, adminRouter);

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
