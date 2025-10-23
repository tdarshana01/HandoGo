// #!/usr/bin/env node
// // Usage: node scripts/checkPopulate.js <requestId>
// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
// const mongoose = require('mongoose');
// const path = require('path');

// const Request = require('../src/model/service.model');
// // ensure user model is registered
// require('../src/models/User.model');
// const User = require('../src/models/User.model');

// async function main() {
//   const reqId = process.argv[2];
//   if (!reqId) {
//     console.error('Please provide a request id: node scripts/checkPopulate.js <requestId>');
//     process.exit(1);
//   }

//   const mongoURI = process.env.MONGO_URI;
//   if (!mongoURI) {
//     console.error('MONGO_URI not set in .env (check request-service/.env)');
//     process.exit(1);
//   }

//   await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Connected to MongoDB');

//   try {
//     const r = await Request.findById(reqId).populate('customer', 'fullName email').lean();
//     console.log('Populated request:');
//     console.dir(r, { depth: 4 });

//     const customerId = (r && r.customer && (r.customer._id || r.customer)) || null;
//     if (customerId) {
//       const user = await User.findById(customerId).lean();
//       console.log('\nDirect user lookup result:');
//       console.dir(user, { depth: 3 });
//     } else {
//       console.log('\nNo customer id found on request (customer field empty)');
//     }
//   } catch (err) {
//     console.error('Error while checking populate:', err);
//   } finally {
//     await mongoose.disconnect();
//     process.exit(0);
//   }
// }

// main();
