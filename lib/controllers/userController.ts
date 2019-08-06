import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from "express-validator";
import User from '../models/user';
import { UserAuth } from '../models/userAuth';
import * as passport from "passport";
// import "../config/passport";

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

/**
 * This function for user
 * @route get /api/v1/user/{id}
 * @group user - Operations about user
 * @param {intenger} id.path - userId
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const getUserById = (req: Request, res: Response): any => {
  let sess = req.session;
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

/**
 * @typedef User
 * @property {string} nickname
 * @property {string} avatar
 */
/**
 * This function for user
 * @route post /api/v1/user/{id}
 * @group user - Operations about user
 * @param {intenger} id.path - userId
 * @param {User.model} User.body - info
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const updateUser = (req: Request, res: Response): any => {
  let sess = req.session;
  User.findById(req.params.id, (err, user) => {
    const body = req.body
    user = Object.assign(user, body)
    user.save((err, updateUser) => {
      if (err) {
        res.status(400).send(err);
      }
      res.status(200).send({
        status: 200,
        updateUser
      });
    })
  });
}


/**
 * This function for all users
 * @route get /api/v1/users
 * @group user - Operations about user
 * @param {string} req.query - filter
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
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
 * @param {Singup.model} Singup.body - phone and password
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const signupWithPhone = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  await check("phone", "phone is not valid").isMobilePhone('zh-CN').run(req);
  await check("password", "Password must be at least 8 characters long").isLength({ min: 4 }).run(req);

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

/**
 * @typedef Login
 * @property {string} phone
 * @property {string} password - Some description for point - eg: 1234
 */
/**
 * This function for login
 * @route post /api/v1/login
 * @group user - Operations about user
 * @param {Login.model} Login.body - phone and password
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  await check("phone", "phone is not valid").isMobilePhone('zh-CN').run(req);
  await check("password", "Password must be at least 8 characters long").isLength({ min: 4 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array())
  }

  passport.authenticate("local", (err: Error, userAuth) => {
    if (err) { return next(err); }
    if (!userAuth) {
      return res.status(200).send({
        message: 'login error'
      })
    }
    req.logIn(userAuth, async (err) => {
      if (err) { return next(err); }
      const user = await User.findById(userAuth.userId)
      res.status(200).send({
        user
      });
    });
  })(req, res, next);
};

/**
 * This function for logout
 * @route get /api/v1/logout
 * @group user - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
export const logout = (req: Request, res: Response) => {
  console.log(req.session)
  req.logout();
  // res.redirect("/");
  res.status(200).send({
    message: 'success'
  });
};