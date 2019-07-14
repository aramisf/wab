#!/bin/bash

# Make sure you call this script only from npm scripts in package.json (i.e. by
# running the `yarn [ run ] setdb` command.
. .env

sql_create_user() {
  USER=${1:-$PG_MY_USER}
  PASS=${2:-$PG_MY_USER_PASSWORD}
  psql -d "$PGDATABASE" <<< "CREATE USER ${USER} PASSWORD '${PASS}' CREATEDB LOGIN;"
  export PGUSER=$USER
}

sql_drop_user() {
  USER=${1:-$PG_MY_USER}
  psql -d "$PGDATABASE" <<< "DROP USER ${USER};"
}

sql_dropdb() {
  dropdb $PGDATABASE
}

sql_createdb() {
  createdb $PGDATABASE -O $PG_MY_USER
  psql -d "$PGDATABASE" <<< "GRANT ALL PRIVILEGES ON DATABASE \"$PGDATABASE\" TO \"$PG_MY_USER\";"
}

sql_seed() {
  #PGPASSWORD=$PG_MY_USER_PASSWORD psql -d "$PGDATABASE" -U "$PG_MY_USER" -f sql/users.sql
  psql -d "$PGDATABASE" -U "$PG_MY_USER" -f sql/users.sql
}

usage() {
  printf "You're missing a parameter, bro\n"
  exit 1
}

(($# == 0)) && usage

while getopts "uUdDs" opt
do
  case $opt in
    u)
      printf "Creating my default database user...\n"
      sql_create_user
      exit 0
      ;;
    U)
      printf "Dropping my default database user...\n"
      sql_drop_user
      exit 0
      ;;
    d)
      printf "Creating '$PGDATABASE' database\n"
      sql_createdb
      exit 0
      ;;
    D)
      printf "Dropping '$PGDATABASE' database\n"
      sql_dropdb
      exit 0
      ;;
    s)
      printf "Seeding '$PGDATABASE' database\n"
      sql_seed
      exit 0
      ;;
  esac
done

