import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult } from "express-validator";
import User from '../models/user';
import { UserAuth } from '../models/userAuth';
import * as passport from "passport";
import "../config/passport";

export const createUser = (req: Request, res: Response) => {
  let newUser = new User(req.body);

  newUser.save((err, user) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send({
      status: 200,
      user
    });
  });
}

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send({
      status: 200,
      user
    });
  });
}


export const getAlluser = (req: Request, res: Response) => {
  User.find({}, (err, users) => {
    if (err) {
      res.send(err);
    }
    res.status(200).send({
      status: 200,
      users
    });
  });
}

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
  check("phone", "phone is not valid").isMobilePhone('zh-CN');
  check("password", "Password must be at least 8 characters long").isLength({ min: 8 });
  check("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array())
  }

  const newUserAuth = new UserAuth({
    phone: req.body.phone,
    password: req.body.password
  });
  UserAuth.findOne({ phone: req.body.phone }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(200).send({
        message: 'user is exists'
      })
    }
    newUserAuth.save((err): any => {
      if (err) { return next(err); }
      req.logIn(newUserAuth, (err): any => {
        if (err) {
          return next(err);
        }
        res.json({
          message: 'success'
        })
      });
    });
  });
};

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  check("email", "Email is not valid").isEmail();
  check("password", "Password cannot be blank").isLength({ min: 1 });
  sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.redirect("/login");
  }

  passport.authenticate("local", (err: Error, userAuth) => {
    if (err) { return next(err); }
    if (!userAuth) {
      return res.redirect("/login");
    }
    req.logIn(userAuth, (err) => {
      if (err) { return next(err); }
      res.redirect(req.session.returnTo || "/");
    });
  })(req, res, next);
};