# Async Node.js Playground

This repository plays with async configuration of node. The goal is to show how
to add a specific header (correlation-id) to all log output and subsequent
requests. This way you can easily find all log entries of all services. You can
do this manually but it is easier to add these in a central middleware to remove
clutter, clean up interfaces and prevent that it will be forgotten in some
places.

It uses the following dependencies:

- winston.js
- axios
