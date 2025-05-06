const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  return `TXN-${timestamp}-${random}`;
};

export { generateTransactionId };
