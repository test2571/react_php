export const validateLoginForm = (formData) => {
  let errors = {};
  let usernamExp = /^[a-zA-Z0-9]+$/;

  if (!formData.username.trim()) {
    errors.username = "Username is required!";
  } else if (formData.username.length < 5) {
    errors.username = "Userename must be atleast 5 characters.";
  } else if (!usernamExp.test(formData.username)) {
    errors.username = "Username can only contain letters and numbers";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required!";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be atleast 6 characters";
  }
  return errors;
};
