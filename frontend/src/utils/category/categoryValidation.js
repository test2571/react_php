export const categoryValidation = (formData) => {
  let errors = {};
  const categoryExp = /^[a-zA-Z0-9\s]+$/;

  if (!formData.categoryName) {
    errors.categoryName = "Category Name is required!";
  } else if (
    formData.categoryName.length > 20 ||
    formData.categoryName.length < 3
  ) {
    errors.categoryName = "Category name should be between 3 to 20 letters";
  } else if (!categoryExp.test(formData.categoryName)) {
    errors.categoryName =
      "Category name can only contain letters, numbers and spaces.";
  }

  if (!formData.parentCategory) {
    errors.parentCategory = "Please Select Parent Category";
  }

  return errors;
};
