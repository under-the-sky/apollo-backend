import * as passport from "passport";
import * as passportLocal from "passport-local";
import { Request, Response, NextFunction } from "express";
import { UserAuth } from '../models/userAuth';
const LocalStrategy = passportLocal.Strategy;
passport.serializeUser<any, any>((userAuth, done) => {
  done(undefined, userAuth.id);
});

passport.deserializeUser((id, done) => {
  UserAuth.findById(id, (err, userAuth) => {
      done(err, userAuth);
  });
});

passport.use(new LocalStrategy({ usernameField: "phone" }, (phone, password, done) => {
  UserAuth.findOne({ phone: phone.toLowerCase() }, (err, userAuth: any) => {
      if (err) { return done(err); }
      if (!userAuth) {
          return done(undefined, false, { message: `phone ${phone} not found.` });
      }
      userAuth.comparePassword(password, (err: Error, isMatch: boolean) => {
          if (err) { return done(err); }
          if (isMatch) {
              return done(undefined, userAuth);
          }
          return done(undefined, false, { message: "Invalid phone or password." });
      });
  });
}));
