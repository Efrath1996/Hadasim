import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './Dashboard.module.css';

const OwnerDashboard = () => {
  const [suppliersList, setSuppliersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('suppliers');
  const [quantities, setQuantities] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    getSuppliers();
    getOrders();
  }, []);

  const getSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/suppliers', { headers: { Authorization: `Bearer ${token}` },});
      setSuppliersList(res.data);
    } catch (error) {
      console.error("Get suppliers failed", error);
    }
  };

  const getOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/orders', {headers: { Authorization: `Bearer ${token}` }});
      setOrdersList(res.data);
    } catch (error) {
      console.error("Get orders failed", error);
    }
  };

  const quantityChange = (key, value) => {
    setQuantities({ ...quantities, [key]: value });
    setErrorMessages( {...errorMessages, [key]: ''});
  };

  const addToOrder = async (supplier, product, index) => {
    const key = `${supplier._id}:${index}`;
    console.log(quantities[key])
    const enteredQty = parseInt(quantities[key], 10);

    if (isNaN(enteredQty) || enteredQty < product.minQuantity) {
      setErrorMessages({...errorMessages, [key]: `Minimum quantity is ${product.minQuantity}`});
      return;
    }

    const totalPrice = enteredQty * product.price;

    const orderData = {
      supplierId: supplier._id,
      supplierName: supplier.companyName,
      product: 
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: enteredQty,
        total: totalPrice,
      },
      status: 'Waiting for Approval',
    };

    try {
      await axios.post('http://localhost:3001/api/orders', orderData, { headers: { Authorization: `Bearer ${token}` } });
      setOrderSuccess(`${enteredQty} units of ${product.name} from ${supplier.companyName} was orded!`);
      setTimeout(() => setOrderSuccess(null), 5000);
      setQuantities({...quantities, [key]: ''});
      getOrders();
      setActiveTab('orders');
    } catch (error) {
      setIsError(true)
      console.error("Send order failed:", error);
      setOrderSuccess("Send order failed");
      setTimeout(() => setOrderSuccess(null), 3000);
    }
  };

  const confirmReceived = async (orderId) => {
    console.log(orderId)
    try {
      const response = await axios.put(`http://localhost:3001/api/orders/${orderId}/status`,{status: 'Completed'},{headers: { Authorization: `Bearer ${token}`},});
      const updatedOrder = response.data;
      setOrdersList(orders=>{
          const updatedOrders =  orders.map(order=>
            order._id === updatedOrder._id ? updatedOrder : order
          )
          console.log(updatedOrders)
          return updatedOrders;
        }
      );
      //getOrders();
    } catch (error) {
      console.error("Update order status failed", error);
    }
  };
  
  const uniqueProductNames = ['All', ...Array.from(new Set(ordersList.map(order => order.product.name))) ];

  const getRowClassByStatus = (status) => {
    switch (status) {
      case 'Waiting for Approval':
        return 'table-info';
      case 'In Process':
        return 'table-warning';
      case 'Completed':
        return 'table-success';
      case 'Rejected':
        return 'table-danger';
      default:
        return '';
    }
  };

  const filteredOrders = (statusFilter === 'All') ? ordersList : ordersList.filter(order => order.status === statusFilter);

  const suppliersRows = [];
  suppliersList.forEach((supplier) =>
    supplier.products.forEach((product, index) => {
      if (productFilter === 'All' || product.name === productFilter) {
      const key = `${supplier._id}:${index}`;
      suppliersRows.push (
        <tr key={key}>
          <td>{supplier.companyName}</td>
          <td>{supplier.contactName}</td>
          <td>{supplier.email}</td>
          <td><strong>{product.name}</strong></td>
          <td>{product.price} ILS</td>
          <td>{product.minQuantity}</td>
          <td>
            <input type="number" min={product.minQuantity} value={quantities[key]}
              onChange={(e) => quantityChange(key, e.target.value) }
              className="form-control form-control-sm"/>
            {errorMessages[key] && (
              <div className="text-danger small">{errorMessages[key]}</div>
            )}
          </td>
          <td>
            <button className={`btn btn-primary btn-sm ${style.orderButton}`} onClick={() => addToOrder(supplier, product, index)}>
              Order Product
            </button>
          </td>
        </tr>
      );
    }})
  )


  const ordersRows = [];
  filteredOrders.forEach((order) =>
      ordersRows.push(
        <tr  key={`${order._id}`} className={getRowClassByStatus(order.status)}>
          <td>{order.orderNumber}</td>
          <td>{order.supplierName}</td>
          <td>{order.product.name}</td>
          <td>{order.product.quantity}</td>
          <td>{order.product.price} ILS</td>
          <td>{(order.product.price * order.product.quantity).toFixed(2)} ILS</td>
          <td>{order.status}</td>
          <td>
            {order.status === 'In Process' ? (
              <button className="btn btn-success btn-sm" onClick={() => confirmReceived(order._id)} >
                Confirm Received
              </button>
            ) : (
              <span>-</span>
            )}
          </td>
        </tr>
      )
  )

  return (
    <div className={`container mt-5 ${style.dashboardContainer}`}>
      <h2 className={`text-center mb-4 ${style.dashboardTitle}`}>Owner Dashboard</h2>
      {user.role === "owner" ? (
        <div>
      <ul className="nav nav-tabs justify-content-center mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'suppliers' ? 'active text-primary fw-bold' : ''}`} 
            onClick={() => setActiveTab('suppliers')}>
            Order Products
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'orders' ? 'active text-primary fw-bold' : ''}`}
            onClick={() => setActiveTab('orders')} >
            All Orders
          </button>
        </li>
      </ul>

      {orderSuccess && (
        <div className={`${isError ? 'alert-danger' : 'alert-info' } alert text-center`}>{orderSuccess}</div>
      )}

      {activeTab === 'suppliers' ? (  //suppliersTab active
        suppliersList.length === 0 ? (
          <p className="text-center text-muted">No suppliers found</p>
        ) : (
          <div>
            <div className="mb-3 text-end">
              <select className="form-select w-auto d-inline-block" value={productFilter} onChange={e => setProductFilter(e.target.value)}>
              {uniqueProductNames.map(name => ( <option key={name} value={name}>{name}</option> ))}
              </select>
            </div>
            <div className="table-responsive">
              <table className={`table table-bordered ${style.suppliersTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>Company Name</th>
                    <th>Contact Name</th>
                    <th>Email</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Min Quantity</th>
                    <th>Order Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersRows}
                </tbody>
              </table>
            </div>
        </div>
        )
      ) : (  //ordersTab active
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

          <div className="table-responsive">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted">No orders found</p>
            ) : (
              <table className={`table table-bordered ${style.suppliersTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>Order Num</th>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersRows}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      </div>
    ):(
      <div className="text-center text-bg-danger"> Access to this dashboard is allowed for owners only</div>)}
    </div>
  );
};

export default OwnerDashboard;
