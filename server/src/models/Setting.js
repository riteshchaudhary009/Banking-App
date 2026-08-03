import mongoose from 'mongoose';

// Singleton document holding system-wide info (name, logo, cover, etc.)
const settingSchema = new mongoose.Schema({
  name: { type: String, default: 'MISSION DREAM' },
  shortName: { type: String, default: 'MISSION DREAM' },
  logo: { type: String, default: '' },
  cover: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
