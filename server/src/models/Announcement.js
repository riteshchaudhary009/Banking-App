import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  announcement: { type: String, required: true },
}, { timestamps: { createdAt: 'dateCreated', updatedAt: 'dateUpdated' } });

export default mongoose.model('Announcement', announcementSchema);
