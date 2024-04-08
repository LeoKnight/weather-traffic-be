#!/bin/bash

# Enter PostgreSQL container
docker exec my_postgres_db bash <<EOF

# connect to PostgreSQL
psql -U your_username -d your_database <<EOSQL

# install PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

EOSQL

EOF