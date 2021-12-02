const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.getUsers = asyncHandler(async (req, res) => {
  const users1 = await User.find({});
  return res.json({ users: users1 });
});

exports.searchUsers = asyncHandler(async (req, res) => {
  const users1 = await User.find({ firstName: req.body.search });
  console.log(req.body.search);
  if (users1) {
    return res.status(200).json({
      user: users1,
    });
  } else {
    return res.status(401).json({ message: "User doesn't exist" });
  }
});

exports.addUser = (req, res) => {
  User.findOne({ firstName: req.body.firstName }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already exists",
      });

    const { firstName, lastName } = req.body;
    const _user = new User({
      firstName,
      lastName,
    });

    console.log(firstName, lastName);

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "User created successfully",
        });
      }
    });
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already exists",
      });

    const { firstName, lastName, email, password } = req.body;
    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username: Math.random().toString(),
    });

    _user.save((error, data) => {
      if (error) {
        return res.statusCode(400).json({
          message: "Something went wrong",
        });
      }

      if (data) {
        return res.status(201).json({
          message: "User created successfully",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: `Something went wrong` });
    }
  });
};

exports.requireSignin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  req.user = user;
  next();
  // jwt.decode();
};
