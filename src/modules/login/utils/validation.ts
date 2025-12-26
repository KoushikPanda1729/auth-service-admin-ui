import { VALIDATION_RULES } from "../../../utils/constants";

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  }

  return errors;
};
