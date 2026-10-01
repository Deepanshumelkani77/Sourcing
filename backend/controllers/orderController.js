const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order
const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, billingAddress, notes } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and items are required'
      });
    }

    // Validate user exists
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate totals
    let totalQuantity = 0;
    let totalAmount = 0;

    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productId, quantity, and price'
        });
      }

      // Validate product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      totalQuantity += item.quantity;
      totalAmount += item.quantity * item.price;
    }

    // Generate order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);

    const order = await Order.create({
      orderNumber,
      userId,
      items,
      totalQuantity,
      totalAmount,
      status: 'Pending',
      shippingAddress: shippingAddress || '',
      billingAddress: billingAddress || '',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('createOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create order'
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'productName')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('getAllOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch orders'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email phone')
      .populate('items.productId', 'productName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('getOrderById:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch order'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Prevent status update for delivered orders
    if (order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of delivered orders'
      });
    }

    order.status = status;
    await order.save();

    // If order is delivered, update user's totalSpent and totalOrders
    if (status === 'Delivered') {
      const User = require('../models/User');
      const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await User.findByIdAndUpdate(
        order.userId,
        {
          $inc: {
            totalOrders: 1,
            totalSpent: orderTotal
          }
        }
      );

      // Check if all orders in its container are delivered
      const Container = require('../models/Container');
      const container = await Container.findOne({ 'goods.orderId': id });

      console.log('Order delivered, checking container:', container?._id);

      if (container && container.currentStatus !== 'Completed') {
        const orderIds = container.goods.map(good => good.orderId);
        console.log('Container order IDs:', orderIds);

        const deliveredOrders = await Order.find({
          _id: { $in: orderIds },
          status: 'Delivered'
        });

        console.log('Delivered orders count:', deliveredOrders.length, 'Total orders:', orderIds.length);

        // If all orders in container are delivered, update container to Completed
        if (deliveredOrders.length === orderIds.length) {
          console.log('All orders delivered, setting container to Completed');
          container.currentStatus = 'Completed';
          container.statusHistory.push({
            status: 'Completed',
            notes: 'All orders delivered',
            location: '',
            updatedBy: req.user._id
          });
          await container.save();
          console.log('Container saved with Completed status');
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('updateOrderStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update order status'
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('deleteOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete order'
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'productName slug images')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('getUserOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch orders'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
};
