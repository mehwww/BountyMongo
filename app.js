var cp = require('child_process');
cp.exec('mongod');
cp.exec('grunt ./original/client/Gruntfile.js')
cp.fork('./original/server/app.js');	