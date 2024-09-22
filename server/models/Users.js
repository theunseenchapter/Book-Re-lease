const dbPromise = require("../db"); // Import the db promise
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

// Clean up user data
User.prototype.cleanUp = function () {
  this.data = {
    userName: this.data.userName,
    userEmail: this.data.userEmail,
    userPhone: this.data.userPhone,
    userPassword: this.data.userPassword,
    userErp: this.data.userErp,
    userClass: this.data.userClass,
    userSection: this.data.userSection,
    createdAt: new Date(),
  };
};

// Get all users
User.prototype.allUsers = async function () {
  const userCollection = await dbPromise; // Wait for DB connection
  let data = await userCollection.find({}).toArray();
  return data;
};

// Create a new user
User.prototype.createUser = async function () {
  this.cleanUp();
  const userCollection = await dbPromise; // Wait for DB connection
  const existingUser = await userCollection.findOne({
    userEmail: this.data.userEmail,
  });

  if (existingUser) {
    return "User with this email already exists. Please use another email.";
  }

  this.data.userPassword = await bcrypt.hash(this.data.userPassword, 10);
  let data = await userCollection.insertOne(this.data);

  return data.acknowledged ? "ok" : "fail";
};

// User login
User.prototype.login = async function () {
  try {
    this.cleanUp();
    const userCollection = await dbPromise; // Wait for DB connection
    const attemptedUser = await userCollection.findOne({
      userEmail: this.data.userEmail,
    });

    if (attemptedUser && bcrypt.compareSync(this.data.userPassword, attemptedUser.userPassword)) {
      this.data = attemptedUser;
      return attemptedUser;
    } else {
      return "fail";
    }
  } catch (error) {
    return "Please Try again later.";
  }
};

// Find user by ID
User.prototype.makeRSVP = async function () {
  const userCollection = await dbPromise; // Wait for DB connection
  const id = this.data._id; // Ensure you have the correct ID

  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (user) {
    console.log(user.userName);
    return user.userName; // Or return the entire user object if needed
  } else {
    return "User not found.";
  }
};

// Get all users (duplicate method)
User.prototype.getAllUsers = async function () {
  const userCollection = await dbPromise; // Wait for DB connection
  let data = await userCollection.find({}).toArray();
  return data;
};

module.exports = User;
