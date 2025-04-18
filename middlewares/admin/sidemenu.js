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
      id: 'banner',
      name: 'Banner',
      href: '#',
      active: req.path === '/banner',
    },
    {
      id: 'settings',
      name: 'Settings',
      href: '#',
      active: req.path === '/settings',
    },
    {
      id: 'coupons',
      name: 'Coupons',
      href: '/admin/coupons',
      active: req.path === '/coupons',
    },
  ];
  next();
};

export default adminSidebar;
