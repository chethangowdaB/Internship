import express from 'express';
import mongoose from 'mongoose';
import { User, Chat, Message } from '../mongo/mongoschema.js';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';

const app = express();
const httpServer = createServer(app); 

const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());


mongoose.connect('mongodb://127.0.0.1:27017/internship', {
  
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));




cloudinary.v2.config({
    cloud_name: 'dbnwyuek6',
    api_key: '176676696182239',
    api_secret: 'dnVDxBaV9oBpoQIAV-ywWET6MRs',
    secure: true,
  });


const upload = multer({ dest: 'uploads/' });



app.post('/signup', upload.single('avatar'), async (req, res) => {
  const { phoneNumber, password, username } = req.body;
  const existingUser = await User.findOne({ phoneNumber });
  
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let avatarUrl = '';
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: 'uploads' });
      avatarUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading avatar' });
    }
  }

  const newUser = new User({ 
    phoneNumber, 
    password: hashedPassword, 
    username, 
    avatar: avatarUrl 
  });
  await newUser.save();
  
  res.cookie('userId', newUser._id, { httpOnly: true });
  res.status(201).json({ message: 'User registered', userId: newUser._id, avatar: newUser.avatar });
});

 
app.post('/login', async (req, res) => {
  console.log("Entering login process");
  console.log(req.body);

  const { phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({
    message: 'Login successful',
    userId: user._id,
    userDetails: {
      phoneNumber: user.phoneNumber,
      username:user.username,
      avatar: user.avatar
      
    },
  });
});

app.get('/users/search', async (req, res) => {
  const { query } = req.query;
  console.log(query);
  
  if (!query || query.length < 10) {
    return res.status(400).json({ message: 'Search query must be at least 10 characters long.' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: new RegExp(query, 'i') },
        { phoneNumber: query }
      ]
    }).limit(10);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/friends/add', async (req, res) => {
  const { userId, friendId } = req.body;
  
  try {
    const user = await User.findById(userId);
    
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
      res.status(200).json({ message: 'Friend added' });
    } else {
      res.status(400).json({ message: 'Already friends' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username avatar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/messages/:userId/:friendId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { user: req.params.userId, friendId: req.params.friendId },
        { user: req.params.friendId, friendId: req.params.userId },
      ],
    }).populate('user', 'username avatar'); 
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
io.on('chat message', async (messageData) => {
  const message = new Message({
    user: messageData.user,
    text: messageData.text,
    createdAt: Date.now(),
  });
  await message.save();
  socket.emit('chat message', message);
});





const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
