import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatInterface = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/search?query=${search}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await axios.post('http://localhost:3000/friends/add', { userId: user.userId, friendId });
      fetchFriends();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/friends/${user.userId}`);
      setFriends(response.data.friends);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
  };

  const fetchMessages = async (friendId) => {
        try {
      const response = await axios.get(`http://localhost:3000/messages/${user.userId}/${friendId}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    if (selectedFriend && newMessage) {
      const messageData = {
        user: user.userId,
        friendId: selectedFriend._id,
        text: newMessage,
      };
      socket.emit('chat message', messageData);
      setNewMessage('');
    }
  };

  useEffect(() => {
    socket.on('chat message', (message) => {
      if (selectedFriend && message.friendId === selectedFriend._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    fetchFriends();
  }, [selectedFriend]);

  return (
    <div className="chat-container">
      <div className="profile-header">
        <img src={user.avatar} alt="User Avatar" className="user-avatar" />
        <h2>{user.username}</h2>
      </div>
      <div className="friends-list">
        <input
          type="text"
          placeholder="Search for friends"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {searchResults.map((friend) => (
            <li key={friend._id}>
              {friend.username}
              <button onClick={() => handleAddFriend(friend._id)}>Add Friend</button>
            </li>
          ))}
        </ul>
        <ul>
          {friends.map((friend) => (
            <li key={friend._id} onClick={() => handleFriendClick(friend)}>
              
              <img src={friend.avatar} alt="Friend Avatar" className="friend-avatar" />
              Chat with {friend.username}
            </li>
          ))}
        </ul>
      </div>
      {selectedFriend && (
        <div className="chat-box">
          <h3>Chat with {selectedFriend.username}</h3>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.user === user._id ? 'my-message' : 'friend-message'}>
                {msg.user !== user._id && <img src={selectedFriend.avatar} alt="Friend Avatar" className="friend-avatar" />}
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
