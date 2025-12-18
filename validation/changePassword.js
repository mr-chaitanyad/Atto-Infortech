const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateLogin(data) {
  let errors = {};

  data.current_pass = !isEmpty(data.current_pass) ? data.current_pass : '';
  data.new_pass = !isEmpty(data.new_pass) ? data.new_pass : '';


  if (Validator.isEmpty(data.current_pass)) {
    errors.message = "Current password field required!";
    errors.success = false;
    errors.code = 400;
  }

  if (Validator.isEmpty(data.new_pass)) {
    errors.message = "New password field required!";
    errors.success = false;
    errors.code = 400;
  }

  if (!Validator.isLength(data.new_pass, {
      min: 6,
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