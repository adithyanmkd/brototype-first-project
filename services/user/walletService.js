import mongoose from 'mongoose';

// import models
import { Wallet, WalletTransaction, Order } from '../../models/index.js';

// import utils
import verifyRazorpaySignature from '../../utils/verifyRazorpaySignature.js';

// import services
import orderService from './orderService.js';

let walletService = {
  getWallet: async ({ userId }) => {
    let wallet = await Wallet.findOne({ userId });

    // create a wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
      });
    }

    return wallet;
  },

  // get all transaction if no transaction gives a empty []
  getTransactions: async ({ userId, limit }) => {
    let query = WalletTransaction.find({ userId }).sort({
      createdAt: -1,
    });

    if (limit) {
      query = query.limit(Number(limit));
    }
    let transactions = await query;

    return transactions;
  },

  // transaction create service
  createTransaction: async ({
    userId,
    type,
    transactionId,
    transactionNote,
    orderId,
    amount,
    description,
  }) => {
    try {
      const transaction = await WalletTransaction.create({
        userId,
        type,
        transactionId,
        transactionNote,
        orderId,
        amount,
        description,
      });

      return transaction;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // topup service
  topup: async ({ userId, paymentId, orderId, signature, amount }) => {
    try {
      let wallet = await walletService.getWallet({ userId });

      // Skip signature verification for internal transactions (e.g., referral rewards)
      if (signature) {
        let isVerified = verifyRazorpaySignature({
          orderId,
          paymentId,
          signature,
        });

        // checking signature
        if (!isVerified) {
          throw new Error('Invalid Razorpay signature. verification failed');
        }
      }

      // update wallet balance
      wallet.balance += amount;
      await wallet.save();

      // create new wallet transaction
      await walletService.createTransaction({
        userId,
        type: 'credit',
        transactionId: paymentId,
        orderId,
        amount,
        transactionNote: 'Wallet top-up',
        description: `Top-up of ₹${amount} was successful.`,
      });

      return {
        success: true,
        message: `Top-up of ₹${amount} was successful.`,
        redirect: '/account/wallet',
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: error.message || 'Wallet top-up failed',
      };
    }
  },

  // purchase product with wallet
  purchaseWithWallet: async ({ userId }) => {
    try {
      let wallet = await walletService.getWallet({ userId });

      let { totalAmount, discount } = await orderService.getCartSummery({
        userId,
      });

      let amount = totalAmount - discount;

      if (wallet.balance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // update wallet balance
      wallet.balance -= amount;
      await wallet.save();

      const newOrder = await orderService.createOrder({
        userId,
        paymentMethod: 'wallet',
      });

      let orderId = newOrder.order._id; // fetching order id

      let transaction = await walletService.createTransaction({
        userId,
        transactionId: `TXN_${orderId}_${Date.now()}`,
        amount,
        description: `Purchased ₹${amount} worth product using wallet`,
        orderId,
        transactionNote: 'Purchases product using wallet.',
        type: 'debit',
      });

      if (!transaction) {
        throw new Error('Transaction creation failed');
      }

      const order = await Order.findOne({ _id: orderId, userId });

      // update payment status
      order.paymentStatus = 'paid';
      await order.save();

      return {
        success: true,
        message: 'Purchase successful using wallet',
        order,
        redirect: '/payment/success-view',
      };
    } catch (error) {
      console.error('Error in purchaseWithWallet:', error);
      return {
        success: false,
        message: error.message || 'Wallet purchase failed',
        error: error.message,
      };
    }
  },
};

export { walletService };
