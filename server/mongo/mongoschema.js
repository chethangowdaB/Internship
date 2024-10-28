import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: '' },
  avatar: { type: String, default: '' },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
export const Chat = mongoose.model('Chat', chatSchema);
export const Message = mongoose.model('Message', messageSchema);
