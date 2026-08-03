// Seeds the database with an initial admin user, a couple of sample client
// accounts, and starter announcements — mirrors the original PHP app's demo data.
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Account from './models/Account.js';
import Announcement from './models/Announcement.js';
import Transaction from './models/Transaction.js';
import Setting from './models/Setting.js';
import mongoose from 'mongoose';

dotenv.config();

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}), Account.deleteMany({}), Announcement.deleteMany({}),
    Transaction.deleteMany({}), Setting.deleteMany({}),
  ]);

  const adminPass = await bcrypt.hash('admin123', 10);
  await User.create({
    firstname: 'Administrator', lastname: 'Admin', username: 'admin',
    password: adminPass, type: 1,
  });

  const clientPass = await bcrypt.hash('client123', 10);
  const john = await Account.create({
    accountNumber: '6231415', pin: '0623', firstname: 'John', lastname: 'Smith',
    middlename: 'D', email: 'jsmith@sample.com', password: clientPass,
    generatedPassword: '', balance: 18000,
  });
  const claire = await Account.create({
    accountNumber: '10140715', pin: '6231415', firstname: 'Claire', lastname: 'Blake',
    middlename: 'C', email: 'cblake@sample.com', password: clientPass,
    generatedPassword: '', balance: 21500,
  });

  await Transaction.create([
    { account: john._id, type: 1, amount: 18000, remarks: 'Beginning balance' },
    { account: claire._id, type: 1, amount: 21500, remarks: 'Beginning balance' },
  ]);

  await Announcement.create({
    title: 'Welcome',
    announcement: '<p>Welcome to the Online Banking System. This is a sample announcement.</p>',
  });

  await Setting.create({ name: 'Online Banking System', shortName: 'OBS' });

  console.log('Seed complete.');
  console.log('Admin login -> username: admin / password: admin123');
  console.log('Client login -> email: jsmith@sample.com / password: client123');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
