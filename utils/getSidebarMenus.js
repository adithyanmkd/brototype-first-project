function getUserMenus(user) {
  const menu = [
    { name: 'My Profile', href: '/account/my-details' },
    { name: 'My Orders', href: '/account/orders' },
    { name: 'Wallet', href: '/account/wallet' },
    { name: 'My Addresses', href: '/account/address' },
    { name: 'My Wishlist', href: '/account/wishlist' },
    { name: 'Refer and Earn', href: '/account/referral' },
  ];

  if (!user.isGoogleUser) {
    menu.splice(1, 0, {
      name: 'Change Password',
      href: '/account/change-password',
    });
  }

  return menu;
}

export default getUserMenus;
