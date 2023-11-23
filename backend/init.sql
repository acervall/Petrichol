DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL
);

CREATE TABLE folders (
  id serial PRIMARY KEY,
  name text NOT NULL,
  user_id integer,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE lists (
  id serial PRIMARY KEY,
  name text NOT NULL,
  homepage boolean DEFAULT false,
  user_id integer,
  folder_id integer,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id serial PRIMARY KEY,
  name text NOT NULL,
  list_id integer,
  FOREIGN KEY(list_id) REFERENCES lists(id) ON DELETE CASCADE
);

CREATE TABLE images (
  id serial PRIMARY KEY,
  url text NOT NULL,
  alt text, 
  user_id integer,
  active boolean,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION create_list_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_list_id INTEGER;
BEGIN
  INSERT INTO lists (name, homepage, user_id) VALUES ('To Do', true, NEW.id) RETURNING id INTO new_list_id;

  INSERT INTO tasks (name, list_id) VALUES ('First task', new_list_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_list_after_user_insert
AFTER INSERT
ON users
FOR EACH ROW
EXECUTE FUNCTION create_list_for_new_user();

CREATE OR REPLACE FUNCTION update_image_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.id <> NEW.id) THEN
    UPDATE images
    SET active = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


INSERT INTO users (username, first_name, last_name, email, password, salt)
VALUES
  ('john_doe', 'John', 'Doe', 'john.doe@example.com', 'password123', md5(random()::text))
RETURNING id, salt;

INSERT INTO users (username, first_name, last_name, email, password, salt)
VALUES
  ('jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'securePassword456', md5(random()::text))
RETURNING id, salt;

INSERT INTO users (username, email, password, salt, first_name, last_name) 
VALUES ('poi','poi','poi','poi@poi.poi','0376fa67c73e968307bf1087960d498ce9bccc8360ef0f6a2f29c0e84fc2001f','b836da54fafc7c8f23cc58e959498f6c') 
RETURNING *;

INSERT INTO images (url, alt, user_id, active)
VALUES ('https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg', 'background', 3, true)
RETURNING *;

-- Inserting a list without associating it with a folder:
INSERT INTO lists (name, user_id, folder_id) VALUES ('To do', 1, NULL);
INSERT INTO lists (name, user_id, folder_id) VALUES ('Job', 1, NULL);
INSERT INTO lists (name, user_id, folder_id) VALUES ('Training', 1, NULL);
INSERT INTO lists (name, user_id, folder_id) VALUES ('School', 1, NULL);

-- Inserting tasks into a list:
INSERT INTO tasks (name, list_id) VALUES ('Buy groceries', 1);
INSERT INTO tasks (name, list_id) VALUES ('Pick up dry cleaning', 1);
INSERT INTO tasks (name, list_id) VALUES ('Prepare presentation', 2);
INSERT INTO tasks (name, list_id) VALUES ('Complete the project', 2);
INSERT INTO tasks (name, list_id) VALUES ('Run 10k', 3);
INSERT INTO tasks (name, list_id) VALUES ('Run 5k', 3);

-- Inserting a folder for a user:
INSERT INTO folders (name, user_id) VALUES ('Wedding', 1);
INSERT INTO folders (name, user_id) VALUES ('Personal task', 1);


-- Inserting a list associated with a folder:
INSERT INTO lists (name, user_id, folder_id) VALUES ('Wish list', 1, 1);
INSERT INTO lists (name, user_id, folder_id) VALUES ('Wedding venue', 1, 1);
INSERT INTO lists (name, user_id, folder_id) VALUES ('Guest list', 1, 1);


/* Insert tasks into the 'Wish list' */
INSERT INTO tasks (name, list_id) VALUES ('Plates', 5);
INSERT INTO tasks (name, list_id) VALUES ('Jewelry', 5);

/* Insert tasks into the 'Wedding venue' */
INSERT INTO tasks (name, list_id) VALUES ('Research venues', 6);
INSERT INTO tasks (name, list_id) VALUES ('Contact catering services', 6);

/* Insert tasks into the 'Guest list' */
INSERT INTO tasks (name, list_id) VALUES ('Send invitations', 7);
INSERT INTO tasks (name, list_id) VALUES ('Confirm RSVPs', 7);

-- SELECT * FROM folders WHERE id = $1;
-- SELECT * FROM lists WHERE id = $1;
-- SELECT * FROM tasks WHERE id = $1;
-- SELECT * FROM users WHERE id = $1;
