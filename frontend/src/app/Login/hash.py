import bcrypt

# Replace with the actual plain-text password and hash
plain_password = "password123"  # Replace with the correct password
stored_hash = "$2b$12$iRQlvEnzwypPwmNjTWEFf.XeRU62NjmixU8sw94ZpNYt5IVXjFksy"

# Verify the password
if bcrypt.checkpw(plain_password.encode('utf-8'), stored_hash.encode('utf-8')):
    print("Password verification successful")
else:
    print("Password verification failed")