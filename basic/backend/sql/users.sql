CREATE TABLE users(
  username_hash character(64),
  password_hash character(64)
);

INSERT INTO users(username_hash, password_hash) VALUES
('abc1', 'pwd1'),
('def2', 'pwd2');
