import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
import api from '../api/axios';
import type { Order } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/v1/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Container><p>Loading...</p></Container>;

  return (
    <Container>
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${order.amount}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
