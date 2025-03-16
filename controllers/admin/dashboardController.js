//get dashboard
const getDashboard = (req, res) => {
    res.render('admin/pages/dashboard/Dashboard', {
        layout: 'layouts/admin-layout.ejs',
    })
}

//export controllers
export default {
    getDashboard,
}
