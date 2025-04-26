import mongoose from 'mongoose';

// import models
import { Wallet, WalletTransaction } from '../../models/index.js';

// import utils
import verifyRazorpaySignature from '../../utils/verifyRazorpaySignature.js';

let walletService = {
  getWallet: async (userId) => {
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
  getTransactions: async (userId) => {
    let transactions = await WalletTransaction.find({ userId }).sort({
      createdAt: -1,
    });

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
    }
  },

  // topup service
  topup: async ({ userId, paymentId, orderId, signature, amount }) => {
    try {
      let wallet = await walletService.getWallet(userId);

      let isVerified = verifyRazorpaySignature(orderId, paymentId, signature);

      // checking signature
      if (!isVerified) {
        throw new Error('Invalid razaorpay signature. verification failed');
      }

      // update wallet balance
      wallet.balance += amount;
      wallet.save();

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
};

export { walletService };
