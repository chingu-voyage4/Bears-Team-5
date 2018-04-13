const jwt = require('jsonwebtoken');

function verify(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.authData = decoded;
    next();
  } catch (err) {
    next();
  }
}

module.exports = verify;
