const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS rsvps');
  await pool.query('DROP TABLE IF EXISTS events');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id          SERIAL PRIMARY KEY,
      title             TEXT NOT NULL,
      description       TEXT,
      date              TEXT NOT NULL,
      location          TEXT NOT NULL,
      event_type        TEXT NOT NULL,
      max_capacity      INTEGER NOT NULL,
      user_id           INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE rsvps (
      rsvp_id          SERIAL PRIMARY KEY,
      user_id          INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      event_id         INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
      UNIQUE (user_id, event_id)
    )
  `);

  const aliceHash = await bcrypt.hash('password123', SALT_ROUNDS);
  const bobHash = await bcrypt.hash('hunter2', SALT_ROUNDS);
  const carolHash = await bcrypt.hash('opensesame', SALT_ROUNDS);

  const insertUserSql =
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id;';

  const aliceResponse = await pool.query(insertUserSql, ['alice', aliceHash]);
  const bobResponse = await pool.query(insertUserSql, ['bob', bobHash]);
  const carolResponse = await pool.query(insertUserSql, ['carol', carolHash]);

  const aliceId = aliceResponse.rows[0].user_id;
  const bobId = bobResponse.rows[0].user_id;
  const carolId = carolResponse.rows[0].user_id;

  const eventQuery =
    'INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  await pool.query(eventQuery, [
    'Tech Summit 2026',
    'A full-day conference covering AI, cloud infrastructure, and developer tooling.',
    '2026-05-15',
    'Philadelphia Convention Center',
    'conference',
    300,
    1,
  ]);

  await pool.query(eventQuery, [
    'Product Design Con',
    'Talks and workshops on UX research, design systems, and prototyping.',
    '2026-06-20',
    'OneLiberty Observation Deck, Philadelphia',
    'conference',
    150,
    2,
  ]);

  await pool.query(eventQuery, [
    'Intro to PostgreSQL',
    'Hands-on workshop walking through schemas, indexes, and query optimization.',
    '2026-05-08',
    'Fishtown Coworking, Philadelphia',
    'workshop',
    25,
    1,
  ]);

  await pool.query(eventQuery, [
    'Sourdough Baking 101',
    'Learn to make and maintain a starter and bake your first loaf.',
    '2026-05-22',
    'Reading Terminal Market Demo Kitchen',
    'workshop',
    12,
    3,
  ]);

  await pool.query(eventQuery, [
    'Philly JS Meetup — May',
    'Monthly JavaScript meetup: lightning talks, Q&A, and networking.',
    '2026-05-13',
    'Yards Brewing Co., Philadelphia',
    'meetup',
    80,
    2,
  ]);

  await pool.query(eventQuery, [
    'Indie Hackers Happy Hour',
    'Casual drinks and conversation for founders and side-project builders.',
    '2026-05-29',
    'Prohibition Taproom, Philadelphia',
    'meetup',
    40,
    2,
  ]);

  await pool.query(eventQuery, [
    'Board Game Night',
    'Bring your favourite games or try one of ours. All skill levels welcome.',
    '2026-05-10',
    'Hex & Co. Games Café, Philadelphia',
    'social',
    30,
    3,
  ]);

  await pool.query(eventQuery, [
    'Rooftop Movie Night — Inception',
    'Open-air screening with blankets, snacks, and city views.',
    '2026-07-04',
    'The Rooftop at Cira Centre South',
    'social',
    60,
    1,
  ]);

  await pool.query(eventQuery, [
    'Saturday Morning Run Club',
    '5-mile group run along Kelly Drive. All paces welcome, coffee after.',
    '2026-05-17',
    'Lloyd Hall, Kelly Drive',
    'fitness',
    50,
    2,
  ]);

  await pool.query(eventQuery, [
    'Yoga in the Park',
    'One-hour flow session on the grass. Bring your own mat.',
    '2026-05-24',
    'Clark Park, West Philadelphia',
    'fitness',
    35,
    3,
  ]);

  const rsvpQuery = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)';

  // Tech Summit
  await pool.query(rsvpQuery, [2, 1]);
  await pool.query(rsvpQuery, [3, 1]);

  // Intro to PostgreSQL
  await pool.query(rsvpQuery, [2, 3]);
  await pool.query(rsvpQuery, [3, 3]);

  // Philly JS Meetup
  await pool.query(rsvpQuery, [1, 5]);
  await pool.query(rsvpQuery, [3, 5]);

  // Board Game Night
  await pool.query(rsvpQuery, [1, 7]);
  await pool.query(rsvpQuery, [2, 7]);

  // Saturday Run Club
  await pool.query(rsvpQuery, [1, 9]);
  await pool.query(rsvpQuery, [2, 9]);

  // Yoga in the Park
  await pool.query(rsvpQuery, [1, 10]);

  // Indie Hackers Happy Hour
  await pool.query(rsvpQuery, [1, 6]);
  await pool.query(rsvpQuery, [3, 6]);

  // Product Design Con
  await pool.query(rsvpQuery, [3, 2]);

  // Rooftop Movie Night
  await pool.query(rsvpQuery, [2, 8]);
  await pool.query(rsvpQuery, [3, 8]);

  console.log('Database seeded.');
};

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
