const User = require('../models/User');
const MatchRequest = require('../models/MatchRequest');
const Report = require('../models/Report');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User verified', user });
  } catch (err) {
    next(err);
  }
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User banned', user });
  } catch (err) {
    next(err);
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unbanned', user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reported', 'name email');
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

exports.reportUser = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const reportedUser = await User.findById(req.params.id);
    if (!reportedUser) return res.status(404).json({ message: 'User not found' });
    const report = new Report({
      reporter: req.user._id,
      reported: req.params.id,
      reason,
    });
    await report.save();
    res.json({ message: 'Report received' });
  } catch (err) {
    next(err);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, verifiedUsers, bannedUsers, totalReports, recentUsers, totalAdmins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isBanned: true }),
      Report.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ role: 'admin' })
    ])
    res.json({
      totalUsers,
      verifiedUsers,
      bannedUsers,
      totalReports,
      recentUsers,
      totalAdmins
    })
  } catch (err) {
    next(err)
  }
} 