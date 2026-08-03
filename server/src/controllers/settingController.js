import Setting from '../models/Setting.js';

async function getOrCreateSettings() {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
}

export async function getSettings(req, res) {
  const settings = await getOrCreateSettings();
  res.json(settings);
}

export async function updateSettings(req, res) {
  const settings = await getOrCreateSettings();
  const { name, shortName } = req.body;
  if (name) settings.name = name;
  if (shortName) settings.shortName = shortName;
  if (req.files?.logo?.[0]) settings.logo = `uploads/${req.files.logo[0].filename}`;
  if (req.files?.cover?.[0]) settings.cover = `uploads/${req.files.cover[0].filename}`;
  await settings.save();
  res.json({ message: 'Settings successfully updated.', settings });
}
