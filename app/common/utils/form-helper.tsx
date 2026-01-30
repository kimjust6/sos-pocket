// helper method that validates email addresses
export const validateEmail = (email: string) => {
  let error;
  if (!email) {
    error = "Email is Required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(email)) {
    error = "Invalid email address.";
  }
  return error;
};

// helper method that validates required strings
export const validateRequiredField = (
  value: string,
  fieldName: string = "Field"
) => {
  let error;
  if (!value) {
    error = fieldName + " is required.";
  } else if (value.length > 40) {
    error = "Field must be less than 40 characters.";
  }
  return error;
};

// helper method that validates required strings
export const validatePassword1 = (password: string) => {
  let error;
  if (!password) {
    error = "Password is required.";
  } else if (password.length < 8) {
    error = "Password must be at least 8 characters.";
  } else if (!/.*[0-9].*/i.test(password)) {
    error = "Password must have at least one number.";
  } else if (!/.*[a-zA-Z].*/i.test(password)) {
    error = "Password must have at least one letter.";
  } else if (!/.*[*@!#%&()^~{}].*/i.test(password)) {
    error = "Password must have at least one special character *@!#%&()^~{}.";
  }
  return error;
};

export const validatePassword2 = (password1: string, password2: string) => {
  let error;
  if (!password2) {
    error = "Password is required.";
  } else if (password1 !== password2) {
    error = "Passwords must match.";
  }
  return error;
};

export const validatePostalCode = (code: string) => {
  let error;
  if (!code) {
    error = "Postal Code is required.";
  } else if (
    !/^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][ -]?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/i.test(
      code
    )
  ) {
    error = "Invalid Postal Code.";
  }
  return error;
};
