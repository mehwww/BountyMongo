var cp = require('child_process');
cp.exec('mongod');
cp.fork('./original/server/app.js');	