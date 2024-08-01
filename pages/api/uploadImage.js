// pages/api/uploadImage.js
import { storage } from '../../firebaseConfig';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// This is needed to parse the form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/public/uploads');
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing the file' });
      }
      
      try {
        const file = files.file[0];
        const filePath = file.filepath;
        const fileName = path.basename(filePath);
        
        const bucket = storage.bucket();
        const uploadResponse = await bucket.upload(filePath, {
          destination: `images/${fileName}`,
          metadata: {
            contentType: file.mimetype,
          },
        });
        
        fs.unlinkSync(filePath); // Remove the file from local storage
        
        const [fileMetadata] = await bucket.file(`images/${fileName}`).getMetadata();
        const downloadURL = fileMetadata.mediaLink;
        
        res.status(200).json({ url: downloadURL });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
