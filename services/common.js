const passport = require("passport");

exports.isAuth = () => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  //this is temporary token for testing without cookie
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Nzg1NDQ5YzIwZWExM2FkM2M4YWIwYSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIwMzMxMTEyfQ.oISZDFWG3Yc_Yys-AGTdOJF8ce7T4iH0PRo_ugU9Yw0"; //stanny@gmail.com
  return token;
};
