const jwtDecode = require("jwt-decode");

module.exports = function validateJwt(req) {
  const expired = false;
  const token = req.get("authorization").split(" ")[1];
  // Get username
  const decoded = jwtDecode(token);
  const { id, exp } = decoded || {};
  const currentTime = Date.now() / 1000;
  if (exp < currentTime) {
    expired = true;
  }
  return { expired, id };
};
