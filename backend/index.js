// index.js (entry point)
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables

import app from './app.js';

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
