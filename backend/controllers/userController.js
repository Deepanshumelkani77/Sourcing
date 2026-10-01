const User = require('../models/User');
const Order = require('../models/Order');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {}; // All users in User model are customers now

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    // Calculate real totals for each user
    const usersWithTotals = await Promise.all(
      users.map(async (user) => {
        const deliveredOrders = await Order.find({
          userId: user._id,
          status: 'Delivered'
        });

        const totalOrders = deliveredOrders.length;
        const totalSpent = deliveredOrders.reduce((sum, order) => {
          return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);

        return {
          ...user.toObject(),
          totalOrders,
          totalSpent
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: usersWithTotals
    });
  } catch (error) {
    console.error('getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('getUserById:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch user'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete user'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser
};
