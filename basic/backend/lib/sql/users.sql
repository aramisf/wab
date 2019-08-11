CREATE TABLE users(
  username_hash character(128), -- hexa representation of a 512 bit string
  password_hash character(128), -- hexa representation of a 512 bit string
  session_id character(36)
);

INSERT INTO users(username_hash, password_hash) VALUES
('abc1', 'pwd1'),
('def2', 'pwd2');
