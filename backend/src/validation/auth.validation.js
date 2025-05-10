const Joi = require('joi');


module.exports = {
  signup : {
    body: Joi.object().keys({
      fullName: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    
    }),
  }
,
  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    }),
  },
  logout: {
    body: Joi.object().keys({}),
  },
};