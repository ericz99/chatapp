const Joi = require("@hapi/joi");

module.exports = {
    validateBody: schema => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema, { abortEarly: false });
            if (result.error) {
                const { details } = result.error;
                const errorMessage = details.map(val => {
                    return { key: val.context.key, label: val.message };
                });

                return res.status(400).json({
                    statusCode: 400,
                    error: errorMessage,
                    data: null
                });
            }

            if (!req.value) {
                req.value = {};
            }
            req.value["body"] = result.value;
            next();
        };
    },
    schemas: {
        registerSchema: Joi.object().keys({
            fullName: Joi.string()
                .required()
                .error(errors => {
                    return {
                        message: "Full Name field is required!"
                    };
                }), email: Joi.string()
                    .email()
                    .required()
                    .error(errors => {
                        return {
                            message: "Email field is required!"
                        };
                    }),
            password: Joi.string()
                .required()
                .regex(/^[a-zA-Z0-9]{3,30}$/)
                .error(errors => {
                    return {
                        message: "Password field is required!"
                    };
                }),
            confirmPassword: Joi.any()
                .required()
                .valid(Joi.ref("password"))
                .error(errors => {
                    return {
                        message: "Confirm Password must match with password!"
                    };
                }),
        }),
        authSchema: Joi.object().keys({
            email: Joi.string()
                .email()
                .required()
                .label("Email field is required!"),
            password: Joi.string()
                .required()
                .label("Password field is required!")
        })
    }
};