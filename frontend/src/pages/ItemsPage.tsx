import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import api from '../api/axios';
import { useCartStore } from '../stores/cartStore';
import type { Item } from '../types';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const fetchItems = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/items', { params: { search: query } });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(search);
  };

  return (
    <Container>
      <h2 className="mb-4">Catalog</h2>
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline-primary">
            Search
          </Button>
        </InputGroup>
      </Form>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {items.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text className="fw-bold">${item.price}</Card.Text>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => addItem(item)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
