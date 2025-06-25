const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token, Authorization denied." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded) {
        req.user = decoded;

        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return res.status(403).json({ success: false, message: "Access Denied!" });
        }

        next();
      }
    } catch (error) {
      console.log("Error in authMiddleware:", error);
      res.status(401).json({ success: false, message: "Token is invalid!" });
    }
  };
};

module.exports = authMiddleware;
