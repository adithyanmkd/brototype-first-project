import redisClient from '../../config/redisConfig.js';
import { Product, Order, Address } from '../../models/index.js';

const prepareOrderData = async (userId) => {
  try {
    // fetching raw data from redis for create order
    let cartRaw = await redisClient.get(`cart:${userId}`);
    let discountRaw = await redisClient.get(`couponDiscount:${userId}`);
    let addressId = await redisClient.get(`address:${userId}`); // this is not raw data

    // parse raw data into object
    let cart = JSON.parse(cartRaw);
    let discount = discountRaw ? JSON.parse(discountRaw) : 0;

    let address = await Address.findById(addressId); // find address by id

    // accessing address for order
    let deliveryAddress = {
      name: address.name,
      phone: address.phone,
      address: address.address,
      locality: address.locality,
      district: address.district,
      state: address.state,
      pincode: address.pincode,
    };

    let cardImagePaths = [];

    let orderedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        cardImagePaths.push(product.images.cardImage.path); // images pushing for order thumbnails

        return {
          productId: product._doc._id,
          productName: product._doc.productName,
          thumbnail: product._doc.images.cardImage.path,
          quantity: item.quantity,
          price: product._doc.price.sellingPrice,
        };
      })
    );

    const paymentMethod = 'razorpay';

    // calculating total price
    let totalAmount = orderedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // new order creating
    let newOrder = await Order.create({
      userId,
      orderedItems,
      orderThumbnail: cardImagePaths[0], // now displaying 1st card image thumnail or oder list page
      productName: orderedItems[0].productName,
      discountAmount: discount,
      totalAmount: totalAmount - discount,
      paymentMethod,
      deliveryAddress,
    });

    // descrease the quantity from the product
    for (let item of cart.items) {
      let product = await Product.findById(item.productId);
      product.quantity -= item.quantity;
      await product.save();
    }

    // remove cart items and address
    await redisClient.del(
      `cart:${userId}`,
      `address:${userId}`,
      `couponDiscount:${userId}`
    );

    return newOrder;
  } catch (error) {
    console.error(error);
  }
};

export { prepareOrderData };
