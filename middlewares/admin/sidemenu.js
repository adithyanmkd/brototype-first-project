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
      toggleId: 'customer-icon',
      name: 'Customers',
      nestedItems: [
        {
          name: 'All Customers',
          href: '/admin/customers',
          linkId: 'all-customer',
          active: req.path === '/customers',
        },
        {
          name: 'Customer Details',
          href: '#',
          linkId: 'single-customer',
          active: req.path === '/customers/details',
        },
      ],
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
          name: 'Add Product',
          href: '/admin/products/add',
          linkId: 'add-product',
          active: req.path === '/products/add',
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
  ]
  next()
}

export default adminSidebar
