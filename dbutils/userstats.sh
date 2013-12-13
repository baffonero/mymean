#!/bin/sh

#----------------------------------------------------
# export new users data
#----------------------------------------------------

DATE=`date '+%Y%m%d'`
mongo --quiet quserstats.js > tmpfiles/userstats_${DATE}.csv
