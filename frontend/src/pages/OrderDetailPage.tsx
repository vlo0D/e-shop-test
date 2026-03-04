import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Table, Alert } from 'react-bootstrap';
import api from '../api/axios';
import type { OrderDetail } from '../types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/v1/orders/${id}`);
        setOrder(res.data);
      } catch (err: any) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Container><p>Loading...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!order) return null;

  return (
    <Container>
      <Link to="/orders" className="mb-3 d-inline-block">&larr; Back to orders</Link>
      <h2 className="mb-2">Order #{order.id}</h2>
      <p className="text-muted">
        Placed on {new Date(order.created_at).toLocaleDateString()}
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>${item.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4>Total: ${order.amount}</h4>
    </Container>
  );
}
