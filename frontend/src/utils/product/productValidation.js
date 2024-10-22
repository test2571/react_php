export const productValidation = (formData) => {
  let errors = {};

  // Regex for color validation
  const colorExp = /^[a-zA-Z]+$/;

  // Ensure price, mfrCost, minPrice, discount, and stockQuantity are treated as numbers
  const price = parseFloat(formData.price);
  const mfrCost = parseFloat(formData.mfrCost);
  const minPrice = parseFloat(formData.minPrice);
  const discount = parseFloat(formData.discount);
  const stockQuantity = parseInt(formData.stockQuantity, 10);

  // Validate SKU length
  if (formData.sku.length < 3 || formData.sku.length > 15) {
    errors.sku = "SKU must be between 3 and 15 characters long.";
  }

  // Product name validation
  if (formData.productName.length < 3 || formData.productName.length > 50) {
    errors.productName = "Product name should be between 3 and 50 characters.";
  }

  // Color name validation
  if (!colorExp.test(formData.color)) {
    errors.color = "Color should only contain letters.";
  }

  // Size validation
  if (!formData.size) {
    errors.size = "Size is Required";
  }

  // Description validation
  if (formData.description.length < 10) {
    errors.description = "Description must be at least 10 characters long.";
  }

  // Price validation
  if (isNaN(price) || price <= 0) {
    errors.price = "Please enter a valid price greater than 0.";
  }

  // Validate that the price is greater than the manufacturer cost
  if (price <= mfrCost) {
    errors.price = "Price must be greater than Manufacturer cost.";
  }

  // Validate that the price is greater than the minimum price
  if (price <= minPrice) {
    errors.price = "Price must be greater than Minimum price.";
  }

  // Discount validation
  if (discount !== 0) {
    if (isNaN(discount) || discount < 0) {
      errors.discount = "Discount must be a non-negative number.";
    } else if (discount >= price) {
      errors.discount = "Discount must be less than the price.";
    } else if (discount <= mfrCost) {
      errors.discount = "Discount must be greater than Manufacturer cost.";
    } else if (discount <= minPrice) {
      errors.discount = "Discount must be greater than the Minimum price.";
    }
  }

  // Stock quantity validation
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    errors.stockQuantity = "Stock Quantity must be a positive number or zero.";
  }

  // MFR cost validation
  if (isNaN(mfrCost) || mfrCost < 0) {
    errors.mfrCost = "Manufacturer Cost must be greater than 0.";
  }

  // Shipping cost validation
  if (
    isNaN(parseFloat(formData.shippingCost)) ||
    parseFloat(formData.shippingCost) < 0
  ) {
    errors.shippingCost = "Shipping cost cannot be negative.";
  }

  // Minimum price validation
  if (isNaN(minPrice) || minPrice <= 0) {
    errors.minPrice = "Minimum price must be greater than 0.";
  }

  // Ensure minimum price is less than the product price
  if (minPrice >= price) {
    errors.minPrice = "Minimum price must be less than the product price.";
  }

  // Ensure minimum price is greater than manufacturer cost
  if (minPrice <= mfrCost) {
    errors.minPrice = "Minimum price must be greater than Manufacturer cost.";
  }

  return errors;
};
