const User = require("../model/User");
const Note = require("../model/Note");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select("-password").lean();

    if(!users.length) {
        return res.status(400).json({message: "No users found"});
    }

    res.json(users);
}

// @desc Create new user
// @route POST /user
// access Private
const createNewUser = async (req, res) => {
    const { username, password, roles } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }

    const duplicate = await User.findOne({username}).collation({locale: "en", strength: 2}).lean();

    if(duplicate) {
        return res.status(400).json({message: "Duplicate username"});
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10); // salt round

    const userObject = (!Array.isArray(roles) || !roles.length) 
        ? { username, "password": hashPassword }
        : { username, "password": hashPassword, roles}

    // Create & store new user
    const user = await User.create(userObject);

    if (user) {
        return res.status(201).json({message: `New user ${username} created`});
    } else {
        return res.status(400).json({ message: "Invalid user data received" });
    }
}

// @desc Update a user
// @route PATH /user
// @acces Private
const updateUser = async (req, res) => {
    const {id, username, roles, active, password} = req.body;
    console.log(id)
    
    if(!id || !username || !roles.length || !Array.isArray(roles) || typeof active !== "boolean") {
        return res.status(400).json({
            message: "All fields except password are requied"
        });
    }

    const  user = await User.findById(id);

    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    // Check duplicate
    const duplicate = await User.findOne({username}).collation({locale: "en", strength: 2}).lean();

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({message: "Duplicate username"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10);
    }

    const updateUser = await user.save();

    res.json({mesage: `${updateUser.username} updated`});
}

// @desc Delete a user
// @route DELETE /user
// @access Private
const deleteUser = async (req, res) => {
    const { id }  = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID required" });
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean();

    if (note) {
        return res.status(400).json({ message:  "User has assigned notes" });
    }

    // Check exist
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const result = user.deleteOne();

    res.json({ message: `Username ${result.username} with ID ${result._id} deleted` });
}

module.exports = {
    getAllUsers,
    createNewUser, 
    updateUser,
    deleteUser
}