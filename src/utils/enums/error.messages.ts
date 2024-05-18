export enum ErrorMessages {
    USER_ALREADY_EXISTS = 'Email already in use by another user.',
    USER_NOT_FOUND = 'User does not exist. Kindly create a new account.',
    INCORRECT_LOGIN_CREDENTIALS = 'Incorrect login details.',
    PRODUCT_ALREADY_EXISTS = 'Product already added.',
    PRODUCT_NOT_FOUND = 'Product not found.',

    FIRSTNAME_REQUIRED = 'Firstname is required',
    LASTNAME_REQUIRED = 'Lastname is required',
    EMAIL_REQUIRED = 'Email is required',
    PASSWORD_REQUIRED = 'Password is required',
    PASSWORD_CONFIRMATION_REQUIRED = 'Password confirmation is required',
    FIRSTNAME_INVALID_CHARACTER_LEGNTH = 'Firstname cannot be less than 3 characters.',
    LASTNAME_INVALID_CHARACTER_LEGNTH = 'Lastname cannot be less than 3 characters.',
    PASSWORD_INVALID_CHARACTER_LEGNTH = 'Password cannot be less than 8 characters.',
    PASSWORDS_DO_NOT_MATCH = 'Passwords do not match',
    INVALID_EMAIL_SUPPLIED = 'Invalid email supplied'
}