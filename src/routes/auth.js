const express = require("express");
const {
  signup,
  signin,
  requireSignin,
  getUsers,
  addUser,
  searchUsers,
} = require("../controller/auth");

const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validator/auth");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router
  .post("/signin", validateSigninRequest, isRequestValidated, signin)
  .get("/users", getUsers)
  .post("/users/search", searchUsers)
  .post("/users", addUser);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
