const User = require('../models/User');
const pagination = require('../utils/pagination');

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Increment profileViews if viewed by someone else
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      await User.findByIdAndUpdate(user._id, { $inc: { profileViews: 1 } });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updates = { ...req.body };
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

exports.filterUsers = async (req, res, next) => {
  try {
    const { gender, religion, tribe, minAge, maxAge } = req.query;
    const query = { isBanned: false, isVerified: true };
    if (gender) query.gender = gender;
    if (religion) query.religion = religion;
    if (tribe) query.tribe = tribe;
    if (minAge || maxAge) {
      const now = new Date();
      if (minAge) query.dob = { ...query.dob, $lte: new Date(now.setFullYear(now.getFullYear() - minAge)) };
      if (maxAge) query.dob = { ...query.dob, $gte: new Date(now.setFullYear(now.getFullYear() - maxAge)) };
    }
    const users = await pagination(User, query, req.query);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Count accepted matches
    const totalMatches = await require('../models/MatchRequest').countDocuments({
      status: 'accepted',
      $or: [
        { from: user._id },
        { to: user._id }
      ]
    });
    // Count active chats
    const activeChats = await require('../models/Chat').countDocuments({ participants: user._id });
    res.json({
      profileViews: user.profileViews || 0,
      connectionRate: user.connectionRate || 0,
      totalMatches,
      activeChats
    });
  } catch (err) {
    next(err);
  }
}; 