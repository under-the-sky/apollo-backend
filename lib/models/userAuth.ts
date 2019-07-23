import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;
export type UserAuthDocument = mongoose.Document & {
  phone: string;
  password: string;
  createdAt: Number;
  updateAt: Number;
  userId: string;

  comparePassword: comparePasswordFunction;
};


type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
const userAuthSchema = new Schema({
  userId: {
    type: String
  },
  phone: { type: String, unique: true },
  password: {
    type: String
  },
}, { timestamps: true });
userAuthSchema.pre("save", function save(next) {
  const userAuth = this as UserAuthDocument;
  if (!userAuth.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(userAuth.password, salt, (err: mongoose.Error, hash: string) => {
      if (err) { return next(err); }
      userAuth.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};
userAuthSchema.methods.comparePassword = comparePassword;
export const UserAuth = mongoose.model<UserAuthDocument>('UserAuth', userAuthSchema);
