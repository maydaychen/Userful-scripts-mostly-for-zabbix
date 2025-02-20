#!/bin/bash
time=$(echo | openssl s_client  -connect  $1:443 2>/dev/null | openssl x509 -noout -dates |awk -F'=' 'NR==2{print $2}')
times=$((($(date +%s -d "$time")-$(date +%s))/(60*60*24)))
echo $times

# UserParameter=check_ssl[*],/etc/zabbix/scripts/check_ssl.sh $1