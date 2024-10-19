export const updatePassword = (formData) => {
  let errors = {};

  if (!formData.newPassword) {
    errors.newPassword = "New Password cannot be blank.";
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = "New password must be atleast 6 characters long.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please enter Confirm Password.";
  } else if (formData.confirmPassword.length < 6) {
    errors.confirmPassword =
      "Confirm password must be atleast 6 characters long.";
  } else if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = "Passoword do not match!";
  }

  return errors;
};
