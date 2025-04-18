import User from '../../models/userModel.js'; // user model imported

// get all customer
const getCustomers = async (req, res) => {
  try {
    let searchValue = req.query.search || '';

    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of users per page
    const skip = (page - 1) * limit;

    // Build the search filter
    let filter = {};
    if (searchValue) {
      filter = {
        $or: [
          { name: { $regex: searchValue, $options: 'i' } },
          { email: { $regex: searchValue, $options: 'i' } },
        ],
      };
    }

    // Count total matching users
    const totalCustomers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalCustomers / limit);

    // Fetch filtered and paginated customers
    const users = await User.find(filter).skip(skip).limit(limit);

    res.render('admin/pages/customers/customers', {
      users,
      page,
      totalPages,
      searchValue, // Keep search value in UI
      layout: 'layouts/admin-layout.ejs',
    });
    // res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.json({ Error: error, DeveloperNote: 'get all users route' });
  }
};

// block user
const toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.redirect('back');
  } catch (error) {
    console.error('Error toggling block status:', error);
    res.status(500).send('Server Error');
  }
};

// export all controller
const customerController = {
  getCustomers,
  toggleBlock,
};
export default customerController;
