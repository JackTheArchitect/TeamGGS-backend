const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 255
    }
     
})

// create new User document
userSchema.statics.create = function(email, password, firstName, lastName) {
    // encrypt the password
    const encrypted = crypto.createHmac('sha1', config.pwSecret)
                      .update(password)
                      .digest('base64')
    const user = new this({
        email, 
        password: encrypted, 
        firstName,         
        lastName        
    })

    // a new user document is saved to the database
    return user.save()
}


// for password verification
userSchema.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.pwSecret)
                      .update(password)
                      .digest('base64')
    console.log("inputPassword: " + password);
    console.log("hash inputPassword: " + encrypted);
    console.log("db user Password: " + this.password);
    return this.password === encrypted;
};


// finds a user document in the database by using email 
userSchema.statics.findOneByEmail = function(email) {
    return this.findOne({
        email        
    }).exec()
}


// userSchema.set('toJSON', { // ?
//     getters: true,
//     virtuals: true
// });



// update the document of the user who is signned in and trying to modify the user Info
// updateOne() instead of update()
userSchema.statics.updateOne = function(userName, email) {          
           
    user.userName = userName;    
    user.email = email;    

    // User's new profile is updated to the database
    return user.save()
} 

 
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	console.log('Logged user id: '+ this._id);
	return token;
};

const userModel = mongoose.model('user', userSchema)

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};


module.exports = userModel