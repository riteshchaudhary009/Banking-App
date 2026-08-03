import Announcement from '../models/Announcement.js';

export async function listAnnouncements(req, res) {
  const items = await Announcement.find().sort({ dateCreated: -1 });
  res.json(items);
}

export async function getAnnouncement(req, res) {
  const item = await Announcement.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found' });
  res.json(item);
}

export async function createAnnouncement(req, res) {
  const { title, announcement } = req.body;
  if (!title || !announcement) return res.status(400).json({ message: 'Title and content are required' });
  const item = await Announcement.create({ title, announcement });
  res.status(201).json({ message: 'Announcement successfully saved.', item });
}

export async function updateAnnouncement(req, res) {
  const { title, announcement } = req.body;
  const item = await Announcement.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found' });
  if (title) item.title = title;
  if (announcement) item.announcement = announcement;
  await item.save();
  res.json({ message: 'Announcement successfully saved.', item });
}

export async function deleteAnnouncement(req, res) {
  const item = await Announcement.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Announcement not found' });
  await item.deleteOne();
  res.json({ message: 'Announcement successfully deleted.' });
}
