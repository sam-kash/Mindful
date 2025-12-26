import user from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req, res) => {
  //res.json({ message: "Register API working" });

  const {name, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password , 10);

  const user = await User.create({
    name,
    email,
    password : hashedPassword
  });

  res.status(201).json({
    message: "User registered"
  })
};

export const login = async (req, res) => {
  //res.json({ message: "Login API working" });

  const {email, password} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:"User not found "});

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).json({error:"Invalid credentials"});

  const token = jwt.sign(
    {id : user._id},
    process.env.JWT_SECRET,
    {expiresIn : "7d"}
  );

  res.json({token})
};
