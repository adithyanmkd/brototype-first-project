import bestSellers from '.././../datasets/bestSellerData.js';

//get home page
const getIndex = (req, res) => {
  res.render('user/pages/home/index.ejs', {
    title: 'comfi nest',
    layout: 'layouts/user-layout.ejs',
    bestSellers,
  });
};

export default {
  getIndex,
};
