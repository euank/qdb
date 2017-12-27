#!/bin/sh
set -ex
sed -i "s/%API_ADDRESS%/${API_ADDRESS}/g" /etc/nginx/conf.d/qdb.conf
exec "$@"
