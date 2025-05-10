const User = require("../models/user.model");

/**
 * Create a new user
 * @param {Object} userBody - The user data to create
 */
exports.create = async (userBody) => {
    return User.create(userBody);
}

/**
 * update A user
 * @param {Object} userBody - The user data to update
 * @param {String} userId - The id of the user to update
 * @return {Object} - The updated user
 */
exports.update = async (userBody, userId) => {
    return User.findByIdAndUpdate(userId, userBody, { new: true });
}


/**
 * Get a User by id
 * @param {filter}  - The id of the user to get
 * @return {Object} - The user object
 * @throws {Error} - If the user is not found
 * 
 */
exports.getOne = async (filter) => {
    return User.findOne(filter);
}


/**
 * GEt All users
 * @param {filter}  - The filter to get the users
 * @return {Array} - The array of users
 * @throws {Error} - If the users are not found
 */

exports.getAll = async(filter) => {
    return User.find(filter);
}


