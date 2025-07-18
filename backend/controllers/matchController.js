const User = require('../models/User');
const MatchRequest = require('../models/MatchRequest');

// Helper: check compatibility
function isCompatible(user, candidate) {
  if (candidate.isBanned || !candidate.isVerified) return false;
  if (user.gender === candidate.gender) return false;
  if (user.preferences.preferredGender && user.preferences.preferredGender !== candidate.gender) return false;
  if (user.preferences.preferredReligion && user.preferences.preferredReligion !== candidate.religion) return false;
  if (user.preferences.preferredTribes && user.preferences.preferredTribes.length && !user.preferences.preferredTribes.includes(candidate.tribe)) return false;
  if (user.preferences.ageRange) {
    const age = Math.floor((Date.now() - new Date(candidate.dob)) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < user.preferences.ageRange.min || age > user.preferences.ageRange.max) return false;
  }
  // Language match (at least one in common)
  if (user.preferences.spokenLanguages && user.preferences.spokenLanguages.length) {
    const commonLang = candidate.spokenLanguages.some(lang => user.preferences.spokenLanguages.includes(lang));
    if (!commonLang) return false;
  }
  return true;
}

exports.getSuggestions = async (req, res, next) => {
  try {
    const user = req.user;
    const candidates = await User.find({ _id: { $ne: user._id }, isBanned: false, isVerified: true });
    const suggestions = candidates.filter(candidate => isCompatible(user, candidate));
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    const from = req.user._id;
    const to = req.params.userId;
    if (from.toString() === to) return res.status(400).json({ message: 'Cannot match with yourself' });
    const existing = await MatchRequest.findOne({ from, to });
    if (existing) return res.status(400).json({ message: 'Request already sent' });
    const matchRequest = new MatchRequest({ from, to });
    await matchRequest.save();
    res.status(201).json({ message: 'Match request sent' });
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await MatchRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    request.status = 'accepted';
    await request.save();
    // Create chat if not exists
    const Chat = require('../models/Chat');
    const existingChat = await Chat.findOne({ matchId: request._id });
    if (!existingChat) {
      await Chat.create({
        matchId: request._id,
        participants: [request.from, request.to],
        messages: [],
      });
    }
    // Update connectionRate for both users
    const User = require('../models/User');
    const updateConnectionRate = async (userId) => {
      const user = await User.findById(userId);
      if (!user) return;
      const totalMatches = await MatchRequest.countDocuments({
        status: 'accepted',
        $or: [ { from: userId }, { to: userId } ]
      });
      const profileViews = user.profileViews || 0;
      const connectionRate = profileViews > 0 ? Math.round((totalMatches / profileViews) * 100) : 0;
      user.connectionRate = connectionRate;
      await user.save();
    };
    await Promise.all([
      updateConnectionRate(request.from),
      updateConnectionRate(request.to)
    ]);
    res.json({ message: 'Match request accepted' });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await MatchRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Match request rejected' });
  } catch (err) {
    next(err);
  }
};

exports.getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await MatchRequest.find({ to: req.user._id, status: 'pending' })
      .populate('from', '-password')
      .sort({ createdAt: -1 });
    res.json({ received: requests });
  } catch (err) {
    next(err);
  }
};

exports.getSentRequests = async (req, res, next) => {
  try {
    const requests = await MatchRequest.find({ from: req.user._id })
      .populate('to', '-password')
      .sort({ createdAt: -1 });
    res.json({ sent: requests });
  } catch (err) {
    next(err);
  }
};

exports.getMatchedRequests = async (req, res, next) => {
  try {
    const requests = await MatchRequest.find({
      status: 'accepted',
      $or: [
        { from: req.user._id },
        { to: req.user._id }
      ]
    })
      .populate('from to', '-password')
      .sort({ createdAt: -1 });
    res.json({ matched: requests });
  } catch (err) {
    next(err);
  }
}; 