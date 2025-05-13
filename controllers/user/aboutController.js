const getAboutPage = async (req, res) => {
  try {
    return res.render('user/pages/about/about.ejs');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

let aboutController = {
  getAboutPage,
};

export default aboutController;
