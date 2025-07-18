const Chat = require('../models/Chat');
const MatchRequest = require('../models/MatchRequest');

exports.getChat = async (req, res, next) => {
  try {
    let chat = await Chat.findOne({ matchId: req.params.matchId, participants: req.user._id }).populate('participants', 'name profilePhoto state');
    if (!chat) {
      // Check if match is accepted and user is a participant
      const match = await MatchRequest.findOne({ _id: req.params.matchId, status: 'accepted' });
      if (!match) return res.status(404).json({ message: 'Chat not found' });
      if (
        match.from.toString() !== req.user._id.toString() &&
        match.to.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Create chat if not exists
      chat = await Chat.create({
        matchId: match._id,
        participants: [match.from, match.to],
        messages: [],
      });
      chat = await Chat.findById(chat._id).populate('participants', 'name profilePhoto state');
    }
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    let chat = await Chat.findOne({ matchId: req.params.matchId, participants: req.user._id });
    if (!chat) {
      // Only allow if match is accepted
      const match = await MatchRequest.findOne({ _id: req.params.matchId, status: 'accepted' });
      if (!match) return res.status(403).json({ message: 'No accepted match' });
      chat = new Chat({ matchId: req.params.matchId, participants: [match.from, match.to], messages: [] });
    }
    // Mark as unread for all except sender
    const unreadBy = chat.participants.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    chat.messages.push({ sender: req.user._id, content, unreadBy });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

// Mark all messages as read for the current user
exports.markAsRead = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ matchId: req.params.matchId, participants: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    let updated = false;
    chat.messages.forEach((msg) => {
      if (msg.unreadBy && msg.unreadBy.includes(req.user._id)) {
        msg.unreadBy = msg.unreadBy.filter((id) => id.toString() !== req.user._id.toString());
        updated = true;
      }
    });
    if (updated) await chat.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id });
    res.json(chats);
  } catch (err) {
    next(err);
  }
}; 