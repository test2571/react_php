export const validateRegisterForm = (formData) => {
  let errors = {};
  let usernamExp = /^[a-zA-Z0-9]+$/;
  const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PhoneNoExp = /^[0-9]{10}$/;

  if (!formData.username.trim()) {
    errors.username = "Username is required!";
  } else if (formData.username.length < 5) {
    errors.username = "Username must be atleast 5 characters.";
  } else if (!usernamExp.test(formData.username)) {
    errors.username = "Username can only contain letters and numbers.";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be atleast 6 characters.";
  }

  if (!formData.email.trim()) {
    errors.email = "email is required.";
  } else if (!emailExp.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (formData.fullname.length < 3) {
    errors.fullname = "Full Name must be atleast 3 characters long.";
  }

  if (!PhoneNoExp.test(formData.phoneno)) {
    errors.phoneno = "Phone No must be exactly 10 digits long.";
  }

  return errors;
};
