import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String
  },
  phone: {
    type: Number
  },
  avatar: {
    type: String
  }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);
export default User;