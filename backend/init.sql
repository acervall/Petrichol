DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Folders;
DROP TABLE IF EXISTS Lists;
DROP TABLE IF EXISTS Tasks;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE Folders (
  id serial PRIMARY KEY,
  name text NOT NULL,
  user_id integer,
  FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE Lists (
  id serial PRIMARY KEY,
  name text NOT NULL,
  user_id integer,
  folder_id integer,
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(folder_id) REFERENCES Folders(id)
);

CREATE TABLE Tasks (
  id serial PRIMARY KEY,
  name text NOT NULL,
  list_id integer,
  FOREIGN KEY(list_id) REFERENCES Lists(id) ON DELETE CASCADE
);

INSERT INTO users (id, username, first_name, last_name, email, password)
VALUES
  (DEFAULT, 'john_doe', 'John', 'Doe', 'john.doe@example.com', 'password123'),
  (DEFAULT, 'jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'securePassword456');


-- Inserting a list without associating it with a folder:
INSERT INTO Lists (name, user_id, folder_id) VALUES ('TO DO', 2, NULL);

-- Inserting tasks into a list:
INSERT INTO Tasks (name, list_id) VALUES ('Buy groceries', 1);
INSERT INTO Tasks (name, list_id) VALUES ('Pick up dry cleaning', 1);

-- Inserting a folder for a user:
INSERT INTO Folders (name, user_id) VALUES ('Wedding', 2);

-- Inserting a list associated with a folder:
INSERT INTO Lists (name, user_id, folder_id) VALUES ('Wish list', 2, 1);
INSERT INTO Lists (name, user_id, folder_id) VALUES ('Wedding venue', 2, 1);
INSERT INTO Lists (name, user_id, folder_id) VALUES ('Guest list', 2, 1);


/* Insert tasks into the 'Wish list' */
INSERT INTO Tasks (name, list_id) VALUES ('Plates', 3);
INSERT INTO Tasks (name, list_id) VALUES ('Jewelry', 3);

/* Insert tasks into the 'Wedding venue' */
INSERT INTO Tasks (name, list_id) VALUES ('Research venues', 4);
INSERT INTO Tasks (name, list_id) VALUES ('Contact catering services', 4);

/* Insert tasks into the 'Guest list' */
INSERT INTO Tasks (name, list_id) VALUES ('Send invitations', 4);
INSERT INTO Tasks (name, list_id) VALUES ('Confirm RSVPs', 4);

SELECT * FROM folders WHERE id = $1;
SELECT * FROM lists WHERE id = $1;
SELECT * FROM tasks WHERE id = $1;
SELECT * FROM users WHERE id = $1;
