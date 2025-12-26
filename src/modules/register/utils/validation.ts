import { VALIDATION_RULES } from "../../../utils/constants";

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    errors.name = `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  } else if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    errors.name = `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }

  // Email validation
  if (!email) {
    errors.email = "Email is required";
  } else if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  } else if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    errors.password = `Password must not exceed ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`;
  }

  // Confirm password validation
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
