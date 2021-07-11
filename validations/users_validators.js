const Joi = require('joi')

module.exports = {
    registerValidator: Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
        password: Joi.string()
            .min(8)
            .required(),
        confirm_password: Joi.string()
            .required()
    })
}