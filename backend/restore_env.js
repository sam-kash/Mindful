import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const target = path.join(__dirname, '.env');

if (fs.existsSync(target)) {
    try {
        fs.unlinkSync(target);
        console.log('Deleted existing .env');
    } catch (e) {
        console.error('Failed to delete .env:', e);
    }
}

const content = `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mindful
JWT_SECRET=supersecretmindfulkey
REDIS_PORT=6979
GOOGLE_CLIENT_ID=1097065546000-57arl4k037le9qsivna32f1ig9o45ck.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-pNScuYtV9I_7qAuAJl1Cqy
GOOGLE_REDIRECT_URI=http://localhost:5000/api/oauth/google/callback
FRONTEND_URL=http://localhost:3000`;

fs.writeFileSync(target, content.trim());
console.log('Successfully restored .env file (fresh write).');
