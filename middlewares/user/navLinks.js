const navLinks = (req, res, next) => {
    res.locals.navLinks = [
        { name: 'Products', url: '/products', active: req.path === '/products' },
        { name: 'About', url: '/about', active: req.path === '/about' },
    ]
    next()
}

export default navLinks
