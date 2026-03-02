# Password Reset Guide

## For the Student Account: student1@test.com

You have **3 options** to reset the password:

---

## Option 1: Use the App's "Forgot Password" Feature (NEW!)

I just added a password reset feature to your login screen:

1. Open your app at the login screen
2. Click **"Forgot password?"** link below the Sign In button
3. Enter the email: `student1@test.com`
4. Click **"Send Reset Email"**
5. Check the email inbox for `student1@test.com`
6. Click the reset link in the email
7. Set a new password

---

## Option 2: Use Firebase Console (Fastest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **word-hero-7124d**
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Find the user `student1@test.com` in the list
6. Click the **three dots menu (⋮)** on the right side of that row
7. Select **"Reset password"**
8. Firebase will send a password reset email to `student1@test.com`

---

## Option 3: Manually Set Password in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **word-hero-7124d**
3. Click **Authentication** → **Users**
4. Find `student1@test.com`
5. Click the **three dots menu (⋮)**
6. Select **"Edit user"**
7. You can manually set a new password here

---

## Important Notes

- The password reset email will be sent to `student1@test.com`
- Make sure you have access to that email inbox
- The reset link expires after 1 hour
- If you don't receive the email, check your spam folder
- For test accounts, you might want to use a real email address you can access

---

## Testing the New Feature

1. Go to your app's login page
2. You should see a **"Forgot password?"** link below the Sign In button
3. Click it to access the password reset form
4. Enter the email and click "Send Reset Email"
5. Check the email inbox for the reset link

---

## For Future Students

All students can now reset their own passwords using the "Forgot password?" link on the login screen. No admin intervention needed!
