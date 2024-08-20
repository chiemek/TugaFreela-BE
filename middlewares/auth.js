const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Token verification failed";
      return res.status(403).json({ message });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
