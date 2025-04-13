import Coupon from '../../models/couponModel.js'; // Import the Coupon model

// get all coupons
const coupons = async (req, res) => {
  try {
    const availableCoupons = await Coupon.find().lean();

    res.render('admin/pages/coupon/coupons.ejs', {
      layout: 'layouts/admin-layout.ejs',
      coupons: availableCoupons,
    });
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    // res.status(500).render('admin/pages/coupon/coupons.ejs', {
    //   layout: 'layouts/admin-layout.ejs',
    //   coupons: [],
    //   error: 'Failed to load coupons',
    // });
  }
};

// add a new coupon
const addCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      isActive,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: 'Coupon code already exists' });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      isActive,
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon added successfully',
      coupon: newCoupon,
    });
  } catch (error) {
    console.error('Failed to add coupon:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error while adding coupon' });
  }
};

const editCoupon = async (req, res) => {
  try {
    const {
      couponId,
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!couponId) {
      return res
        .status(400)
        .json({ success: false, message: 'Coupon ID is required' });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        isActive,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Failed to update coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating coupon',
    });
  }
};

const couponController = {
  coupons,
  addCoupon,
  editCoupon,
};

export default couponController;
