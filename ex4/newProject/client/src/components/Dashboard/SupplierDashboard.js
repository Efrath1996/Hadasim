import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierDashboard = () => {
  const [ordersList, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    getSupplierOrders();
  }, []);

  const getSupplierOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/orders/by-supplier`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Get supplier orders failed', error);
    } 
  };

  const statusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/orders/${orderId}/status`,{status: newStatus},{headers: { Authorization: `Bearer ${token}` },});
      const updatedOrder = response.data;
      console.log(updatedOrder)
      setOrders(orders=>{
          const updatedOrders =  orders.map(order=>
            order._id === updatedOrder._id ? updatedOrder : order
          )
          console.log(updatedOrders)
          return updatedOrders;
        }
      );
      //getSupplierOrders();
    } catch (error) {
      console.error('Update order status failed', error);
    }
  };

  const getRowClassByStatus = (status) => {
    switch (status) {
      case 'Waiting for Approval':
        return 'table-warning';
      case 'In Process':
        return 'table-info';
      case 'Completed':
        return 'table-success';
      case 'Rejected':
        return 'table-danger';
      default:
        return '';
    }
  };

  const filteredOrders = (statusFilter === 'All') ? ordersList : ordersList.filter(order => order.status === statusFilter);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Supplier Dashboard</h2>
        {user.role === "supplier" ? (
        <div>
      <div className="mb-3 text-end">
            <select className="form-select w-auto d-inline-block" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Waiting for Approval">Waiting for Approval</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

      { filteredOrders.length === 0 ? (
        <p className="text-center text-muted">No orders found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Order Num</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) =>
                  <tr key={`${order._id}`} className={getRowClassByStatus(order.status)}>
                    <td>{order.orderNumber}</td>
                    <td>{order.product.name}</td>
                    <td>{order.product.quantity}</td>
                    <td>{order.product.price?.toFixed(2)} ILS</td>
                    <td>{(order.product.price * order.product.quantity).toFixed(2)} ILS</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === 'Waiting for Approval' ? (
                        <div className="d-flex gap-2 flex-wrap">
                          <button className="btn btn-sm btn-success col-lg-5 col-12" onClick={() => statusChange(order._id, 'In Process')}>
                            Start Process
                          </button>
                          <button className="btn btn-sm btn-danger col-lg-5 col-12" onClick={() => statusChange(order._id, 'Rejected')}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      </div>
    ):(
      <div className="text-center text-bg-danger">Access to this dashboard is allowed for suppliers only</div>)}
    </div>
  );
};

export default SupplierDashboard;
