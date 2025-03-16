const navLinks = (req, res, next) => {
    res.locals.navLinks = [
        { name: 'Products', url: '/products', active: req.path === '/products' },
        { name: 'Mattress', url: '/mattress', active: req.path === '/mattress' },
        { name: 'Pillows', url: '/pillows', active: req.path === '/pillows' },
        { name: 'Beds', url: '/beds', active: req.path === '/beds' },
        { name: 'About', url: '/about', active: req.path === '/about' },
    ]
    next()
}

export default navLinks
