import app from './app.js';
import connectDB from './config/db.js';
import { seedDemoCatalogIfEmpty } from './utils/seedDemoCatalog.js';

// Keep the local default aligned with the frontend API client.
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoCatalogIfEmpty();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
