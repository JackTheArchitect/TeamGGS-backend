const router = require('express').Router();
const { userModel } = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require("joi");

router.post('/', async (req, res) =>    {
    try{
        const { error } = validate(req.body);
        if (error) {
			return res.status(400).send({ message: error.details[0].message });
        }
        const user = await userModel.findOne({ email: req.body.email });

        // when input email is not found
        if(!user){
			return res.status(401).send({ message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);

        // when input password is not matches with user info
        if (!validPassword){
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // generate auth token when logged in successfully
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" });
} catch (err) {
    res.status(500).send({ data: err.message, message: err.message }); }

});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;