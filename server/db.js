const { Client } = require('pg');


const client = new Client();


client.connect();


async function createTables() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY,
        name VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}


async function createCustomer(name) {
  try {
    const result = await client.query('INSERT INTO customers (id, name) VALUES (uuid_generate_v4(), $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}


async function createRestaurant(name) {
  try {
    const result = await client.query('INSERT INTO restaurants (id, name) VALUES (uuid_generate_v4(), $1) RETURNING *', [name]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
}


async function fetchCustomers() {
  try {
    const result = await client.query('SELECT * FROM customers');
    return result.rows;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}


async function fetchRestaurants() {
  try {
    const result = await client.query('SELECT * FROM restaurants');
    return result.rows;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
}


async function createReservation(date, partyCount, restaurantId, customerId) {
  try {
    const result = await client.query('INSERT INTO reservations (id, date, party_count, restaurant_id, customer_id) VALUES (uuid_generate_v4(), $1, $2, $3, $4) RETURNING *', [date, partyCount, restaurantId, customerId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}


async function destroyReservation(reservationId) {
  try {
    await client.query('DELETE FROM reservations WHERE id = $1', [reservationId]);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}

module.exports = {
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation
};
