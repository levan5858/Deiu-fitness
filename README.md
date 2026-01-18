# Deiu Fitness Website

Static website for Deiu Fitness with a booking form and an admin dashboard.

## Admin Dashboard
- URL: `https://deiu.fitness/admin/`
- Login uses Firebase Auth (Email/Password).

## Firebase Setup Checklist
1. Firebase Auth: enable **Email/Password**.
2. Firestore Database: created in test mode.
3. Firestore rules: paste contents of `firestore.rules` into Firebase Console → Firestore → Rules.
4. Create an admin user:
   - Firebase Console → Authentication → Users → Add user.

## Booking Form
Submissions are stored in Firestore collection: `bookings`.

## Files
- `contact.html`: booking form
- `scripts/booking.js`: form submission to Firestore
- `admin/index.html`: admin dashboard
- `scripts/admin.js`: login + bookings list
- `scripts/firebase.js`: Firebase config + SDK imports

## Notes
- Update the YouTube ID in `media.html` if you want a featured video.
- Custom domain is set to `deiu.fitness` via `CNAME`.
