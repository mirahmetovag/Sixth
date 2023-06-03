const Io = require ('../utils/Io');
const Users = new Io ('./database/users.json');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const key = process.env.JWT_SECRET_KEY;

const register = async (req,res) => {
    const {username, password} = req.body;
    const users = await Users.read();
    
    const findUser = users.find((user) => user.username === username);
    if (findUser) 
     return res.status(409).json({message:"Username has been already registered"});
      
    const id = (users[users.length - 1]?.id || 0) + 1;
    const newUser = new User(id, username, password);
    const data = users.length ? [...users, newUser] : [newUser];
    await Users.write(data);

    const token = await jwt.sign({id: newUser.id}, key)
    res.status(200).json({message: "Success", token});
}

const login = async (req,res) => {
    res.status(200).json({message: "Success"});
}

module.exports = {
    register,
    login,
}