import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String
  },
  avator: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('user', UserSchema);
export default User;