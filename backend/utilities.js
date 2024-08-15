import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ");
  console.log(token);
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

export default authenticateToken;
