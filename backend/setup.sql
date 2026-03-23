CREATE TABLE IF NOT EXISTS users (
                                     id            SERIAL PRIMARY KEY,
                                     name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password      VARCHAR(255) NOT NULL,
    role          VARCHAR(50) DEFAULT 'user',
    street        VARCHAR(255),
    street_number VARCHAR(50),
    city          VARCHAR(255),
    country       VARCHAR(255),
    created_at    TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS books (
                                     id          SERIAL PRIMARY KEY,
                                     title       VARCHAR(255) NOT NULL,
    author      VARCHAR(255) NOT NULL,
    year        INTEGER,
    description TEXT,
    available   BOOLEAN DEFAULT true,
    cover_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS reservations (
                                            id         SERIAL PRIMARY KEY,
                                            book_id    INTEGER REFERENCES books(id) ON DELETE CASCADE,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50) CHECK (type IN ('pickup', 'delivery')),
    status     VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
    );

INSERT INTO books (title, author, year, description, available) VALUES
                                                                    ('Harry Potter', 'J.K. Rowling', 1997, 'Fantasy novel about a young wizard.', true),
                                                                    ('1984', 'George Orwell', 1949, 'Dystopian novel about a totalitarian society.', true),
                                                                    ('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic American novel about the Jazz Age.', false);