#!/bin/sh

#----------------------------------------------------
# Upd mailing list
#----------------------------------------------------

DATE=`date '+%Y%m%d'`

echo "${DATE}" 

mongo --quiet updmail.js
