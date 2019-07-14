CREATE TABLE users(
  username_hash character(1024),
  password_hash character(1024)
);

INSERT INTO users(username_hash, password_hash) VALUES
('abc1', 'pwd1'),
('def2', 'pwd2');
