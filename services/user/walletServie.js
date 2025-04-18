import mongoose from 'mongoose';

// import models
import { Wallet, WalletTransaction } from '../../models/index.js';

let walletService = {
  find: async (userId) => {
    let wallet = await Wallet.findOne({ userId });

    // create a wallet if it doesn't exist
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
      });
    }

    const transactions = await WalletTransaction.find({ userId }).sort({
      createdAt: -1,
    });

    return {
      wallet,
      transactions,
    };
  },
};

export { walletService };
