#!/bin/bash

ps aux | grep -v "grep" | grep -v $0 | awk '{print $11}' |sort | uniq

# UserParameter=process.discovery, sh /etc/zabbix/scripts/process_discovery.sh