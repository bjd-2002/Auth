import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// hadle errors
const handleErrors = (err) => {
    // console.log(err);
    // console.log(err.message, err.code);
    let errors = {email: '', password:''};

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('User validation failed:')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        });
    }

  return errors;

}

async function signup(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

async function login(req, res) {
    // Get the email n pw
    const {email, password} = req.body;

    // Find the user with requested email
    const user = await User.findOne({ email });
    if(!user) return res.sendStatus(401);
    // Compare sent in pw with found user pw hash
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if(!passwordMatch) return res.sendStatus(401);

    // Create a jwt token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({sub: user._id, exp}, process.env.SECRET)
    
    // Set the cookie
    res.cookie("Authorization", token, {
        expires: new Date(exp),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === "production",
    });

    // send it
    res.sendStatus(200);
}
function logout(req, res) {
    res.clearCookie("Authorization");
    res.sendStatus(200);
}

export {
    signup,
    login,
    logout
}