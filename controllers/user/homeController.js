import salesService from '../../services/admin/salesService.js';
// import bestSellers from '.././../datasets/bestSellerData.js';

//get home page
const getIndex = async (req, res) => {
  let { top10Products } = await salesService.getTop10Products();

  res.render('user/pages/home/index.ejs', {
    title: 'comfi nest',
    layout: 'layouts/user-layout.ejs',
    bestSellers: top10Products,
  });
};

export default {
  getIndex,
};
