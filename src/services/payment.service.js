import paystackClient from '../config/paystack.js';
import Fee from '../models/Fee.js';
import Payment from '../models/Fee.js'

export const initializePaystackService = async (payload, user) => {
  console.log(payload);
  console.log(user);
  
  const fee = await Fee.findById(payload.feeId);
  if (!fee) throw new Error('Fee not found');

  console.log(fee);
  

  const response = await paystackClient.post('/transaction/initialize', {
    amount: payload.amount * 100,
    email: payload.email,
    callback_url: payload.callbackUrl,
    metadata: { feeId: fee._id, initiatedBy: user.id }
  });

  console.log(response);
  

  const res = await Fee.create({
    feeId: fee._id,
    studentId: fee.studentId,
    amount: payload.amount,
    reference: response.data.data.reference,
    status: 'pending'
  });

  console.log(res);
  

  return response.data.data;
};

export const verifyPaystackService = async (reference) => {
  const { data } = await paystackClient.get(`/transaction/verify/${reference}`);
  await Payment.findOneAndUpdate(
    { reference },
    { status: data.data.status === 'success' ? 'success' : 'failed', paidAt: new Date(data.data.paid_at) }
  );
  if (data.data.status === 'success') {
    await Fee.findOneAndUpdate({ _id: data.data.metadata.feeId }, { status: 'paid' });
  }
  return data.data;
};
