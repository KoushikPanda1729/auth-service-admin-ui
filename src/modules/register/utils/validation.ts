import { VALIDATION_RULES } from "../../../utils/constants";

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateRegisterForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // First name validation
  if (!firstName) {
    errors.firstName = "First name is required";
  } else if (firstName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    errors.firstName = `First name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  } else if (firstName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    errors.firstName = `First name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }

  // Last name validation
  if (!lastName) {
    errors.lastName = "Last name is required";
  } else if (lastName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    errors.lastName = `Last name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  } else if (lastName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    errors.lastName = `Last name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
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
