#!/bin/bash

# Make sure you call this script only from npm scripts in package.json (i.e. by
# running the `yarn run setdb` command.
. .env

sql_create_user() {
  USER=${1:-$PG_NEW_USER}
  PASS=${2:-$PG_NEW_USER_PASSWORD}
  psql -d "$PGDATABASE" <<< "CREATE USER ${USER} PASSWORD '${PASS}' CREATEDB LOGIN;"
  export PGUSER=$USER
}

sql_drop_user() {
  USER=${1:-$PG_NEW_USER}
  psql -d "$PGDATABASE" <<< "DROP USER ${USER};"
}

sql_dropdb() {
  dropdb $PGDATABASE
}

sql_createdb() {
  createdb $PGDATABASE
}

usage() {
  printf "You're missing a parameter, bro\n"
  exit 1
}

(($# == 0)) && usage

while getopts "uUdD" opt
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
    *)
  esac
done

