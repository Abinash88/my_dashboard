const express = require('express');
const User = require('../models/myModel')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    let exisituser;
    try {
        exisituser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
    }

    if (exisituser) {
        res.status(400).json({ message: 'User already exists login please' });
    } else {
        const bcryptpassword = bcryptjs.hashSync(password);
        const user = new User({
            name,
            email,
            password: bcryptpassword
        })

        try {
            await user.save();
        } catch (err) {
            console.log(err.message);
        }

        res.status(200).json({ message: user })
    }
}


const logins = async (req, res) => {

    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        console.log(err.message);
    }
    if (!user) {
        res.status(400).json({ message: 'User not found' });
    } else {
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'password dont match! try again' })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECREAT_KEY, {
            expiresIn: '35s'
        })
        if (req.cookies[`${user._id}`]) {
            req.cookies[`${user._id}`] = '';
        };
        res.cookie(String(user._id), String(token), {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        })
        res.status(200).json({ message: "login successfully", user: user, token })
    }
}

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie
    console.log(req.headers);
    const token = cookies.split('=')[1];
    if (!token) {
        res.status(400).json({ message: "No token found in cookie" })
    }
    jwt.verify(String(token), process.env.SECREAT_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: "invalid token" })
        }
        req.id = user.id;
    })
    next();
}

const getUser = async (req, res) => {
    const userid = req.id;
    let users;
    try {
        users = await User.findById(userid, '-password');
    } catch (err) {
        console.log(err.message);
    }
    if (!users) {
        res.status(400).json({ message: 'User not found' });
    }
    return res.status(200).json({ users: users })
}

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split('=')[1];
    console.log(token, 'token from refresh token');
    if (!token) {
        res.status(400).json({ message: "invalid refresh token" })
    }
    jwt.verify(String(token), process.env.SECREAT_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: "invalid 2nd refresh token" })
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = '';

        const token = jwt.sign({ id: user.id }, process.env.SECREAT_KEY, {
            expiresIn: '35s'
        })

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax'
        });

        req.id = user.id;
        next();
    })
}


exports.logins = logins;
exports.signup = signup;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;