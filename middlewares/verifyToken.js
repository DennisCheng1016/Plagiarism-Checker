require('dotenv').config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return res.status(400).json({ msg: 'no token provided' });
	}
	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, process.env.TOKEN_SIGNATURE);
		// attach the user to the job routes
		req.email = payload.email;
		next();
	} catch (error) {
		return res.status(401).json({ msg: error.message });
	}
}

module.exports = {
	verifyToken,
};
