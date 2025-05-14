const adminSidebar = (req, res, next) => {
  res.locals.adminSidebar = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      href: '/admin',
      active: req.path === '/',
    },
    {
      id: 'customer-menu',
      name: 'Customers',
      href: '/admin/customers',
      active: req.path === '/customers',
    },
    {
      id: 'sales-report',
      name: 'Sales Report',
      href: '/admin/sales-report',
      active: req.path === '/sales-report',
    },
    {
      id: 'products',
      toggleId: 'product-icon',
      name: 'Product',
      nestedItems: [
        {
          name: 'Product List',
          href: '/admin/products',
          linkId: 'all-product',
          active: req.path === '/products',
        },
        {
          name: 'Category List',
          href: '/admin/categories',
          linkId: 'all-category',
          active: req.path === '/categories',
        },
      ],
    },
    {
      id: 'orders',
      name: 'Orders',
      href: '/admin/orders',
      active: req.path === '/orders',
    },
    {
      id: 'coupons',
      name: 'Coupons',
      href: '/admin/coupons',
      active: req.path === '/coupons',
    },
    {
      id: 'offers',
      toggleId: 'offers-icon',
      name: 'Offers',
      nestedItems: [
        {
          name: 'Product Offer',
          href: '/admin/offers/product',
          linkId: 'all-product',
          active: req.path === '/offers/product',
        },
        {
          name: 'Category Offer',
          href: '/admin/offers/category',
          linkId: 'all-category',
          active: req.path === '/offers/category',
        },
      ],
    },
  ];
  next();
};

export default adminSidebar;
