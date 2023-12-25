import * as path from 'path';

export function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /\.(jpeg|jpg|png|gif|mp4|avi|mkv|mov)$/i;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype =
    file.mimetype.startsWith('image') || file.mimetype.startsWith('video');
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}
