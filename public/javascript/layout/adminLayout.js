
// for dropdown
export function toggleDropdown(menuId, arrowId) {
    const menu = document.getElementById(menuId)
    const toggleArrow = document.getElementById(arrowId)

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden')
        toggleArrow.classList.add('rotate-180')
    } else {
        menu.classList.add('hidden')
        toggleArrow.classList.remove('rotate-180')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname

    if (pathname.includes('/admin/customer')) customersDropdown()
    else if (pathname.includes('/admin/products')) productDropdown()
    else if (pathname.includes('/admin/categories')) categoryDropdown()

    // customer dropdown
    function customersDropdown() {
        toggleDropdown('customer-menu', 'customer-icon')
    }

    // product dropdown
    function productDropdown() {
        toggleDropdown('products', 'product-icon')
    }

    // category dropdown
    function categoryDropdown() {
        toggleDropdown('products', 'product-icon')
    }
})

window.toggleDropdown = toggleDropdown
