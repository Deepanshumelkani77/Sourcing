const Container = require('../models/Container');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new container
const createContainer = async (req, res) => {
  try {
    const {
      // New fields
      blNo,
      vesselName,
      voyageNo,
      pol,
      etd,
      pod,
      eta,
      containerNo,
      sealNo,
      transitRoute,
      noOfShippers,
      shippers,
      // Legacy fields
      containerNumber,
      shippingType,
      origin,
      destination,
      voyageNumber,
      goods
    } = req.body;

    // Check if container number already exists (if provided)
    if (containerNo || containerNumber) {
      const existingContainer = await Container.findOne({
        $or: [
          { containerNo: containerNo || containerNumber },
          { containerNumber: containerNo || containerNumber }
        ]
      });
      if (existingContainer) {
        return res.status(400).json({
          success: false,
          message: 'Container number already exists'
        });
      }
    }

    // Validate and process goods if provided
    let processedGoods = [];
    if (goods && goods.length > 0) {
      for (const item of goods) {
        // Verify order exists
        const order = await Order.findById(item.orderId);
        if (!order) {
          return res.status(400).json({
            success: false,
            message: `Order ${item.orderId} not found`
          });
        }

        // Verify user exists
        const user = await User.findById(item.userId);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: `User ${item.userId} not found`
          });
        }

        // Verify product exists
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.productId} not found`
          });
        }

        processedGoods.push({
          orderId: item.orderId,
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity
        });
      }
    }

    const container = await Container.create({
      // New fields
      blNo: blNo || '',
      vesselName: vesselName || '',
      voyageNo: voyageNo || '',
      pol: pol || origin || '',
      etd: etd ? new Date(etd) : null,
      pod: pod || destination || '',
      eta: eta ? new Date(eta) : null,
      containerNo: containerNo || containerNumber || '',
      sealNo: sealNo || '',
      transitRoute: transitRoute || '',
      noOfShippers: noOfShippers || (shippers ? shippers.length : 0),
      shippers: shippers || [],
      // Legacy fields (for backward compatibility)
      containerNumber: containerNumber || containerNo || '',
      shippingType: shippingType || 'Sea',
      origin: origin || pol || '',
      destination: destination || pod || '',
      voyageNumber: voyageNumber || voyageNo || '',
      goods: processedGoods,
      currentStatus: 'Goods Under Stuffing',
      createdBy: req.user._id,
      statusHistory: [
        {
          status: 'Goods Under Stuffing',
          notes: 'Container created',
          location: pol || origin || '',
          updatedBy: req.user._id
        }
      ]
    });

    await container.populate([
      { path: 'goods.userId', select: 'firstName lastName email' },
      { path: 'goods.orderId', select: 'orderNumber status' },
      { path: 'goods.productId', select: 'productName slug' },
      { path: 'createdBy', select: 'firstName lastName' },
      { path: 'statusHistory.updatedBy', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Container created successfully',
      container
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating container'
    });
  }
};

// Get all containers (admin)
const getAllContainers = async (req, res) => {
  try {
    const { status, destination, search, blNo, containerNo, shipper, buyer } = req.query;
    const filter = {};

    if (status) {
      filter.currentStatus = status;
    }

    // Specific field searches
    if (blNo) {
      filter.blNo = { $regex: blNo, $options: 'i' };
    }

    if (containerNo) {
      filter.$or = [
        { containerNo: { $regex: containerNo, $options: 'i' } },
        { containerNumber: { $regex: containerNo, $options: 'i' } }
      ];
    }

    if (shipper) {
      filter['shippers.name'] = { $regex: shipper, $options: 'i' };
    }

    if (buyer) {
      filter['shippers.contactPerson'] = { $regex: buyer, $options: 'i' };
    }

    // General search across all fields
    if (search && !blNo && !containerNo && !shipper && !buyer) {
      filter.$or = [
        { containerNumber: { $regex: search, $options: 'i' } },
        { containerNo: { $regex: search, $options: 'i' } },
        { blNo: { $regex: search, $options: 'i' } },
        { vesselName: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { pol: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { pod: { $regex: search, $options: 'i' } },
        { 'shippers.name': { $regex: search, $options: 'i' } },
        { 'shippers.contactPerson': { $regex: search, $options: 'i' } }
      ];
    } else if (destination) {
      filter.$or = [
        { destination: { $regex: destination, $options: 'i' } },
        { pod: { $regex: destination, $options: 'i' } }
      ];
    }

    const containers = await Container.find(filter)
      .populate([
        { path: 'goods.userId', select: 'firstName lastName email' },
        { path: 'goods.orderId', select: 'orderNumber status' },
        { path: 'goods.productId', select: 'productName slug' },
        { path: 'createdBy', select: 'firstName lastName' }
      ])
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      containers
    });
  } catch (error) {
    console.error('getAllContainers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching containers'
    });
  }
};

// Get single container by ID
const getContainerById = async (req, res) => {
  try {
    const container = await Container.findById(req.params.id)
      .populate([
        { path: 'goods.userId', select: 'firstName lastName email' },
        { path: 'goods.orderId', select: 'orderNumber status totalQuantity' },
        { path: 'goods.productId', select: 'productName slug images' },
        { path: 'createdBy', select: 'firstName lastName' },
        { path: 'statusHistory.updatedBy', select: 'firstName lastName' }
      ]);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    res.status(200).json({
      success: true,
      container
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching container'
    });
  }
};

// Update container status
const updateContainerStatus = async (req, res) => {
  try {
    const { status, notes, location } = req.body;
    const container = await Container.findById(req.params.id);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    // Prevent status update for completed containers
    if (container.currentStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of completed containers'
      });
    }

    // Prevent manual setting of Completed status
    if (status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Container status cannot be manually set to Completed. It will automatically update when all orders are delivered.'
      });
    }

    // Update current status
    container.currentStatus = status;

    // Add to status history
    container.statusHistory.push({
      status,
      notes: notes || '',
      location: location || '',
      updatedBy: req.user._id
    });

    await container.save();

    // Auto-update orders based on container status
    let orderStatusUpdate = null;
    if (status === 'Under Transportation') {
      orderStatusUpdate = 'Under Delivery';
    }

    if (orderStatusUpdate) {
      const orderIds = container.goods.map(good => good.orderId);
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { status: orderStatusUpdate }
      );
    }

    await container.populate([
      { path: 'statusHistory.updatedBy', select: 'firstName lastName' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Container status updated successfully' + (orderStatusUpdate ? ' and orders updated to ' + orderStatusUpdate : ''),
      container
    });
  } catch (error) {
    console.error('updateContainerStatus error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating container status'
    });
  }
};

// Update container details
const updateContainer = async (req, res) => {
  try {
    const {
      // New fields
      blNo,
      vesselName,
      voyageNo,
      pol,
      etd,
      pod,
      eta,
      containerNo,
      sealNo,
      transitRoute,
      noOfShippers,
      shippers,
      // Legacy fields
      containerNumber,
      shippingType,
      origin,
      destination,
      voyageNumber
    } = req.body;

    const container = await Container.findById(req.params.id);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    // Check if new container number conflicts with existing
    const newContainerNo = containerNo || containerNumber;
    if (newContainerNo && newContainerNo !== container.containerNo && newContainerNo !== container.containerNo) {
      const existingContainer = await Container.findOne({
        $or: [
          { containerNo: newContainerNo },
          { containerNumber: newContainerNo }
        ],
        _id: { $ne: req.params.id }
      });
      if (existingContainer) {
        return res.status(400).json({
          success: false,
          message: 'Container number already exists'
        });
      }
    }

    // Update new fields
    if (blNo !== undefined) container.blNo = blNo;
    if (vesselName !== undefined) container.vesselName = vesselName;
    if (voyageNo !== undefined) container.voyageNo = voyageNo;
    if (pol !== undefined) container.pol = pol;
    if (etd !== undefined) container.etd = etd ? new Date(etd) : null;
    if (pod !== undefined) container.pod = pod;
    if (eta !== undefined) container.eta = eta ? new Date(eta) : null;
    if (containerNo !== undefined) container.containerNo = containerNo;
    if (sealNo !== undefined) container.sealNo = sealNo;
    if (transitRoute !== undefined) container.transitRoute = transitRoute;
    if (noOfShippers !== undefined) container.noOfShippers = noOfShippers;
    if (shippers !== undefined) container.shippers = shippers;

    // Update legacy fields (for backward compatibility)
    if (containerNumber !== undefined) container.containerNumber = containerNumber;
    if (shippingType !== undefined) container.shippingType = shippingType;
    if (origin !== undefined) container.origin = origin;
    if (destination !== undefined) container.destination = destination;
    if (voyageNumber !== undefined) container.voyageNumber = voyageNumber;

    await container.save();

    await container.populate([
      { path: 'goods.userId', select: 'firstName lastName email' },
      { path: 'goods.orderId', select: 'orderNumber status' },
      { path: 'goods.productId', select: 'productName slug' },
      { path: 'createdBy', select: 'firstName lastName' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Container updated successfully',
      container
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating container'
    });
  }
};

// Delete container
const deleteContainer = async (req, res) => {
  try {
    const container = await Container.findByIdAndDelete(req.params.id);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Container deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting container'
    });
  }
};

// Get containers for a specific user (customer dashboard)
const getUserContainers = async (req, res) => {
  try {
    const userId = req.user._id;

    const containers = await Container.find({
      'goods.userId': userId
    })
      .populate([
        { path: 'goods.orderId', select: 'orderNumber status totalQuantity' },
        { path: 'goods.productId', select: 'productName slug images' }
      ])
      .sort({ createdAt: -1 });

    // Filter goods to only show this user's items
    const filteredContainers = containers.map(container => ({
      ...container.toObject(),
      goods: container.goods.filter(item => item.userId.toString() === userId.toString())
    }));

    res.status(200).json({
      success: true,
      containers: filteredContainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user containers'
    });
  }
};

// Get orders available for adding to container (admin)
const getAvailableOrders = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { status: 'Transportation to Shipping Port/Airport' };

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate([
        { path: 'userId', select: 'firstName lastName email' },
        { path: 'items.productId', select: 'productName slug' }
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching available orders'
    });
  }
};

module.exports = {
  createContainer,
  getAllContainers,
  getContainerById,
  updateContainerStatus,
  updateContainer,
  deleteContainer,
  getUserContainers,
  getAvailableOrders
};
