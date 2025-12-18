const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateRegister(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';

  if (Validator.isEmpty(data.name)) {
    errors.message = "Name field is required!";
    errors.success = false;
    errors.code = 400;
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required!";
    errors.success = false;
    errors.code = 400;
  }

  if (!Validator.isEmail(data.email)) {
    errors.message = "Email is Invalid!";
    errors.success = false;
    errors.code = 400;
  }

  if (Validator.isEmpty(data.mobile)) {
    errors.message = "Mobile field is required!";
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