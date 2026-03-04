import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../api/axios';
import type { User } from '../types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', role: 'user', password: '' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/v1/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({ first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, password: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editUser) return;
    setError('');
    try {
      await api.patch(`/api/v1/users/${editUser.id}`, { user: form });
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.errors?.join(', ') || 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/v1/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Container><p>Loading...</p></Container>;

  return (
    <Container>
      <h2 className="mb-4">Manage Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(u)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (leave blank to keep)</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
