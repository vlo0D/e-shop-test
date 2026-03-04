import { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuthStore } from '../stores/authStore';
import api from '../api/axios';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.patch('/api/v1/profile', { user: form });
      updateUser(res.data);
      setSuccess('Profile updated successfully');
      setForm({ ...form, password: '', password_confirmation: '' });
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(', ') || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '500px' }} className="mt-3">
        <Card.Body>
          <h3 className="mb-4">My Profile</h3>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first_name" value={form.first_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" value={form.last_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (leave blank to keep current)</Form.Label>
              <Form.Control type="password" name="password" value={form.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
