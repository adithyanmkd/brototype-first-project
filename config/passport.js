import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import crypto from 'crypto';

// import model
import { User } from '../models/index.js';

// import util functions
import { saveProfileImage } from '../utils/saveProfileImage.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? `${process.env.HOST_URL}/auth/google/callback`
          : 'http://localhost:4000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        // Save profile picture locally
        const savedImagePath = await saveProfileImage(
          profile.photos[0].value,
          profile.id
        );

        // Generate a unique referral code for the new user
        const newReferralCode = crypto.randomBytes(4).toString('hex');

        if (!user) {
          // Create new user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: savedImagePath, // Use locally saved image
            isGoogleUser: true,
            referralCode: newReferralCode,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
