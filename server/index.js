const express = require('express');
const bodyParser = require('body-parser');
const { createTables, createCustomer, createRestaurant, fetchCustomers, fetchRestaurants, createReservation, destroyReservation } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());


createTables();


app.get('/api/customers', async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});


app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});


app.post('/api/customers/:id/reservations', async (req, res) => {
  const customerId = req.params.id;
  const { restaurant_id, date, party_count } = req.body;
  try {
    const reservation = await createReservation(date, party_count, restaurant_id, customerId);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});


app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  const customerId = req.params.customer_id;
  const reservationId = req.params.id;
  try {
    await destroyReservation(reservationId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
}); 