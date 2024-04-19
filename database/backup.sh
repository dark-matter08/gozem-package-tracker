#!/bin/bash
mongodump --uri="mongodb://127.0.0.1:27019/" --db=package-tracker --archive=backup.archive