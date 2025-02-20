#!/bin/bash

pid=`ps -aux | grep java | grep wildfly | grep -v "grep" | grep -v $0 | awk '{print $2}'`

S0U=`jstat -gc $pid | awk '{if(NR!=1) print int($3+0.5)}'`
S1U=`jstat -gc $pid | awk '{if(NR!=1) print int($4+0.5)}'`
EU=`jstat -gc $pid | awk '{if(NR!=1) print int($6+0.5)}'`
OU=`jstat -gc $pid | awk '{if(NR!=1) print int($8+0.5)}'`
heap_memory_used=$((S0U+S1U+EU+OU))
heap_memory_max=`jinfo -flag MaxHeapSize $pid | awk -F "=" '{print $2}'`
echo $heap_memory_used > /var/log/zabbix/heap_memory_used.log
echo $heap_memory_max > /var/log/zabbix/heap_memory_max.log