import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import api from '../api/axios';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        items: items.map((ci) => ({
          item_id: ci.item.id,
          quantity: ci.quantity,
        })),
      };
      const res = await api.post('/api/v1/orders', payload);
      clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Shopping Cart</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ci) => (
                <tr key={ci.item.id}>
                  <td>{ci.item.name}</td>
                  <td>${ci.item.price}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={ci.quantity}
                      onChange={(e) =>
                        updateQuantity(ci.item.id, parseInt(e.target.value) || 1)
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>${(ci.item.price * ci.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(ci.item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Total: ${getTotal().toFixed(2)}</h4>
            <div>
              <Button variant="secondary" className="me-2" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button variant="primary" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
