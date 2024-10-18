const express = require("express");
// const { cloudinary } = require("cloudinary");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.v2.config({
    cloud_name: "dnznafp2a",
    api_key: "395763994312374",
    api_secret: "WIDJWXy0i3sA4iuti8eT93Hpd6Q",
});

module.exports = cloudinary;