import {
  UserRegisterType,
  OrderValidationType,
  ProductValidationType,
  EditableUserType,
} from "@types";
export const loginValidation = (email: string, password: string) => {
  let errors = { email: "", password: "" };

  if (!email) {
    errors.email = "Email is required";
  }

  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const adminLoginValidation = (username: string, password: string) => {
  let errors = { username: "", password: "" };
  if (!username) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const userProfileUpdateValidation = (userDetails: EditableUserType) => {
  const errors = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    homeAddress: {
      address: "",
      city: "",
      postalCode: "",
    },
    deliveryAddress: {
      address: "",
      city: "",
      postalCode: "",
    },
  };

  if (!userDetails.firstName || userDetails.firstName.length < 3) {
    errors.firstName = "First name min 3 character";
  }
  if (!userDetails.lastName || userDetails.lastName.length < 3) {
    errors.lastName = "Last name min 3 character";
  }
  if (!userDetails.email) {
    errors.email = "Email is required";
  } else if (!userDetails.email.includes("@")) {
    errors.email = "Invalid email address";
  }
  if (!userDetails.phoneNumber) {
    errors.phoneNumber = "Phone number is required";
  }

  if (!userDetails.homeAddress?.address) {
    errors.homeAddress.address = "Address is required";
  }
  if (!userDetails.homeAddress?.city) {
    errors.homeAddress.city = "City is required";
  }
  if (!userDetails.homeAddress?.postalCode) {
    errors.homeAddress.postalCode = "Postal code is required";
  }

  if (!userDetails.deliveryAddress?.address) {
    errors.deliveryAddress.address = "Address is required";
  }
  if (!userDetails.deliveryAddress?.city) {
    errors.deliveryAddress.city = "City is required";
  }
  if (!userDetails.deliveryAddress?.postalCode) {
    errors.deliveryAddress.postalCode = "Postal code is required";
  }

  return errors;
};

export const registerFormValidation = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  homeAddress,
  deliveryAddress,
  phoneNumber,
}: UserRegisterType) => {
  let errors: UserRegisterType = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    homeAddress: {
      address: "",
      city: "",
      postalCode: "",
    },
    deliveryAddress: {
      address: "",
      city: "",
      postalCode: "",
    },
  };

  if (!firstName) errors.firstName = "First name is required";
  if (!lastName) errors.lastName = "Last name is required";
  if (!email || !email.includes("@")) errors.email = "Invalid email address";
  if (!phoneNumber) errors.phoneNumber = "Last name is required";

  if (!password || password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (!confirmPassword || confirmPassword.length < 6)
    errors.confirmPassword = "Confirm password must be at least 6 characters";

  if (password !== confirmPassword) {
    errors.password = "Passwords do not match";
    errors.confirmPassword = "Passwords do not match";
  }

  if (!homeAddress.address)
    errors.homeAddress.address = "Home address is required";

  if (!homeAddress.city) errors.homeAddress.city = "Home city is required";

  if (!homeAddress.postalCode)
    errors.homeAddress.postalCode = "Postal code is required";

  if (!deliveryAddress.address)
    errors.deliveryAddress.address = "Delivery address is required";

  if (!deliveryAddress.city)
    errors.deliveryAddress.city = "Delivery city is required";

  if (!deliveryAddress.postalCode)
    errors.deliveryAddress.postalCode = "Postal code is required";

  return errors;
};

export const productFormValidation = (product: ProductValidationType) => {
  const errors = {
    title: "",
    price: "",
    description: "",
    stock: "",
    brand: "",
    categorySlugs: "",
    tags:""
  };

  if (!product.title || product.title.trim().length < 6) {
    errors.title = "Title must be at least 6 characters";
  }

  if (!product.price) {
    errors.price = "Price is required";
  }
console.log(product.categorySlugs);
  if (!product.categorySlugs || product.categorySlugs.length === 0) {
    errors.categorySlugs = "You must select at least 1 category";
  }

  if (!product.tags || product.tags.length === 0) {
    errors.tags = "You must select at least 1 tag";
  }

  if (product.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!product.description) {
    errors.description = "Description is required";
  }

  if (!product.stock) {
    errors.stock = "Stock is required";
  }

  if (!product.brand || product.brand.trim().length < 2) {
    errors.brand = "Brand is required";
  }

  return errors;
};

export const validateOrder = (order: OrderValidationType) => {
  const errors = {
    paymentMethod: "",
    shippingAddress: "",
    deliveryMethod: "",
    cart: "",
  };

  if (!order.paymentMethod) errors.paymentMethod = "Payment method is required";
  if (!order.shippingAddress)
    errors.shippingAddress = "Shipping address is required";
  if (!order.deliveryMethod)
    errors.deliveryMethod = "Delivery method is required";
  if (order.cart.length === 0)
    errors.cart = "CartPage must include at least 1 product";

  return errors;
};

export const validateSlider = ({
  title,
  subtitle,
  description,
  link,
}: Record<string, string>) => {
  const errors: string[] = [];
  if (!title.trim()) errors.push("Title is required.");
  if (!description.trim()) errors.push("Description is required.");
  if (!link.trim()) errors.push("Link is required.");
  if (!subtitle.trim()) errors.push("Subtitle is required.");

  return errors;
};
