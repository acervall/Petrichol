DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO users (id, username, first_name, last_name, email, password)
VALUES
  (DEFAULT, 'john_doe', 'John', 'Doe', 'john.doe@example.com', 'password123'),
  (DEFAULT, 'jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'securePassword456'),
  (DEFAULT, 'alice_jackson', 'Alice', 'Jackson', 'alice.jackson@example.com', 'mySecretPass'),
  (DEFAULT, 'bob_miller', 'Bob', 'Miller', 'bob.miller@example.com', 'p@ssw0rd'),
  (DEFAULT, 'susan_wilson', 'Susan', 'Wilson', 'susan.wilson@example.com', 'strongPss!');
