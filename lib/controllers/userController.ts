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
/**
 * @typedef Singup
 * @property {string} phone
 * @property {string} password - Some description for point - eg: 1234
 * @property {string} nickname
 */
/**
 * This function for signup
 * @route post /api/v1/signup
 * @group user - Operations about user
 * @param {Singup.model} Singup.body - username or email
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const signupWithPhone = async (req: Request, res: Response, next: NextFunction) => {
  await check("phone", "phone is not valid").isMobilePhone('zh-CN').run(req);
  await check("password", "Password must be at least 8 characters long").isLength({ min: 4 }).run(req);
  // check("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array())
  }
  let user = await User.findOne({ phone: req.body.phone })
  if (!user) {
    const newUser = {
      phone: req.body.phone,
      nickname: req.body.nickname
    }
    user = await User.create(newUser)
    const newUserAuth = new UserAuth({
      phone: req.body.phone,
      password: req.body.password,
      userId: user.id
    });
    newUserAuth.save((err): any => {
      if (err) { return next(err); }
      req.logIn(newUserAuth, (err): any => {
        if (err) {
          return next(err);
        }
        res.json(user)
      });
    });
  } else {
    return res.status(200).send({
      message: 'user is exists'
    })
  }
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