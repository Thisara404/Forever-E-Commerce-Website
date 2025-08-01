const User = require('../model/User');
const Order = require('../model/Order');
const Product = require('../model/Product');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top products (most sold)
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $group: { 
          _id: '$items.productId', 
          soldCount: { $sum: '$items.quantity' } 
        } 
      },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          image: '$product.image',
          soldCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        recentOrders,
        topProducts
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Build filter
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/admin/users/:userId/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    const days = parseInt(range.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sales analytics
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category analytics
    const categoryData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        categoryData,
        range
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAnalytics
};