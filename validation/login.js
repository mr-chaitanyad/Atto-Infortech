const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateLogin(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';


  if (Validator.isEmpty(data.password)) {
    errors.message = "Password field required!";
    errors.success = false;
    errors.code = 400;
  }

  if (!Validator.isLength(data.password, {
      min: 1,
      max: 20
    })) {
    errors.message = "Password must be between 2 and 9 characters!";
    errors.success = false;
    errors.code = 400;
  }

  if (Validator.isEmpty(data.mobile)) {
    errors.message = "Mobile field required!";
    errors.success = false;
    errors.code = 400;
  }

  if (!Validator.isMobilePhone(`+91${data.mobile}`, 'en-IN')) {
    console.log(Validator.isMobilePhone(`+91${data.mobile}`, 'en-IN'))
    errors.message = "Invalid Number";
    errors.success = false;
    errors.code = 400;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}