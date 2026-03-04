import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../api/axios';
import type { Item } from '../types';

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/v1/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleNew = () => {
    setEditItem(null);
    setForm({ name: '', description: '', price: '' });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description, price: String(item.price) });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setError('');
    try {
      const payload = { item: { ...form, price: parseFloat(form.price) } };
      if (editItem) {
        await api.patch(`/api/v1/items/${editItem.id}`, payload);
      } else {
        await api.post('/api/v1/items', payload);
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(', ') || 'Save failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/v1/items/${id}`);
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.errors?.join(', ') || 'Delete failed');
    }
  };

  if (loading) return <Container><p>Loading...</p></Container>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Items</h2>
        <Button variant="success" onClick={handleNew}>+ New Item</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>${item.price}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editItem ? 'Edit Item' : 'New Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
