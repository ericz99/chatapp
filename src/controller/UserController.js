const uuid = require('uuid/v4');

// MODEL
const User = require('../models/User');

module.exports = {
    testAPIRoute: async (req, res, next) => {
        return res.status(200).json({
            statusCode: 200,
            error: null,
            data: {
                msg: "User test route worked!"
            }
        });
    },
    registerAPIRoute: async (req, res, next) => {
        const { email } = req.body;

        const userMatch = await User.findOne({ email });

        if (userMatch) {
            return res.status(400).json({
                statusCode: 400,
                error: "Email already exist. Please try a different email!",
                data: {
                    status: "fail",
                    msg: null
                }
            });
        }

        const user = await User.create({ ...req.body, uid: uuid(), date: new Date().getTime() });

        if (user) {
            return res.status(200).json({
                statusCode: 200,
                error: null,
                data: {
                    status: "success",
                    msg: "Successfully created account!"
                }
            });
        }
    },
    loginAPIRoute: async (req, res, next) => {
        const { email } = req.body;

        const userMatch = await User.findOne({ email });

        if (!userMatch) {
            return res.status(400).json({
                statusCode: 400,
                error: "Email does not exist. Please try a different email!",
                data: {
                    status: "fail",
                    msg: null
                }
            });
        }
    }
}