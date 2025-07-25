const Order = require('../model/Order');
const Cart = require('../model/Cart');
const Product = require('../model/Product');
const { validationResult } = require('express-validator');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, paymentMethod, paymentInfo } = req.body;

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: item.size,
        quantity: item.quantity,
        image: product.image[0]
      });
    }

    const shippingFee = 10; // Fixed shipping fee
    const totalAmount = subtotal + shippingFee;

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentInfo: paymentInfo || {},
      subtotal,
      shippingFee,
      totalAmount,
      isPaid: paymentMethod === 'cod' ? false : true, // COD orders are not paid initially
      paidAt: paymentMethod === 'cod' ? null : new Date()
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalAmount: 0, totalItems: 0 }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (status) {
      filter.orderStatus = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('items.productId', 'name image');

    // Get total count
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name image category subCategory');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user (unless admin)
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    order.orderStatus = orderStatus;
    
    // Set delivered date if status is delivered
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user (unless admin)
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;

    // Build filter
    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }
    if (userId) {
      filter.userId = userId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name email')
      .populate('items.productId', 'name image');

    // Get total count
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Calculate order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        statistics: orderStats
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};