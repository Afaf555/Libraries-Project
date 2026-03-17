CREATE TABLE IF NOT EXISTS books (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  author      VARCHAR(255) NOT NULL,
  year        INTEGER,
  description TEXT,
  available   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id         SERIAL PRIMARY KEY,
  book_id    INTEGER REFERENCES books(id) ON DELETE CASCADE,
  type       VARCHAR(50) CHECK (type IN ('pickup', 'delivery')),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO books (title, author, year, description, available) VALUES
  ('Harry Potter', 'J.K. Rowling', 1997, 'Fantasy novel about a young wizard.', true),
  ('1984', 'George Orwell', 1949, 'Dystopian novel about a totalitarian society.', true),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic American novel about the Jazz Age.', false);