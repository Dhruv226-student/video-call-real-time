
const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
exports.protectRoute = async (req, res, next) => {
    try{
        const token = req.headers.authorization || req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token Provided ' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (user.isBlock) {

            return res.status(401).json({ message: 'Account is blocked' });
        }
        req.user = user;
      return  next();
    }catch (error) {
      console.error('Error in protectRoute middleware:', error);
        next(error);
    }
    next();
}