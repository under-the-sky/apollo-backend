import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: {
    type: String
  },
  userId: {
    type: String
  }
}, { timestamps: true });
const Message = mongoose.model('Message', MessageSchema);
export default Message;