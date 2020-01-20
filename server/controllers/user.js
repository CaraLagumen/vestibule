const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  const { email } = req.body;

  if (await User.findOne({ email })) {
    return res.status(404).json({ message: "This email already exists!" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = User.create({
    email: req.body.email,
    password: hashedPassword
  });

  res.status(201).json({
    status: "success",
    user
  });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(404).json({ message: "Incorrect email or password!" });
  }

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    status: "success",
    token,
    expiresIn: 3600,
    user
  });
};
