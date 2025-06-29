export function orderCreatedEmail({ supplier, order }) {
  const product = order.product;
  const totalPrice = product.quantity * product.price;

  return {
    subject: 'New Order Received',
    html: `
      <p>Hi ${supplier.contactName} from ${supplier.companyName},</p>
      <p>You have a new order Number: <strong>${order.orderNumber}</strong></p>
      <p>${product.name} ${product.quantity} X ${product.price} ILS = <strong>${totalPrice.toFixed(2)} ILS</strong></p>
      <p>Please log in to <a href="http://localhost:3000/" target="_blank">Grocery Orders</a> to approve it.</p>
    `,
  };
}


export function orderStatusEmailToOwner({ owner, order, supplier, status }) {
  const product = order.product;
  const totalPrice = product.quantity * product.price;

  const isApproved = status === 'approved';

  return {
    subject: `Order number ${order.orderNumber} of ${supplier.companyName} company ${isApproved ? 'approved' : 'rejected'}`,
    html: `
      <p>Hi ${owner.name},</p>
      <p>Your order number <strong>${order.orderNumber}</strong> has been ${isApproved ? 'approved' : 'rejected'} by ${supplier.contactName} from <strong>${supplier.companyName}</strong>.</p>
      <p><strong>Order details:</strong></p>
      <p>${product.name} ${product.quantity} X ${product.price} ILS = <strong>${totalPrice.toFixed(2)} ILS</strong></p>
      <p>Please log in to <a href="http://localhost:3000/" target="_blank">Grocery Orders</a> to view the order${isApproved ? '' : ' details or take further action'}.</p>
    `,
  };
}

export function orderReceivedConfirmationEmailToSupplier({ supplier, order, owner }) {
  const product = order.product;
  const totalPrice = product.quantity * product.price;

  return {
    subject: `Order number ${order.orderNumber} confirmed received`,
    html: `
      <p>Hi ${supplier.contactName},</p>
      <p>The store owner has confirmed receipt of order number <strong>${order.orderNumber}</strong>.</p>
      <p><strong>Order details:</strong></p>
      <p>${product.name} ${product.quantity} X ${product.price} ILS = <strong>${totalPrice.toFixed(2)} ILS</strong></p>
      <p>Thank you for your cooperation. link to <a href="http://localhost:3000/" target="_blank">Grocery Orders</a></p>
    `,
  };
}

