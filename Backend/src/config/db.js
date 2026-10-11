import mongoose from 'mongoose';

// ─── Slow-query performance monitor ──────────────────────────────────────────
const SLOW_QUERY_THRESHOLD_MS = 200;
const DEFAULT_DB_NAME = 'multivendor';
let performancePluginAttached = false;

function attachPerformancePlugin() {
  if (performancePluginAttached) return;
  performancePluginAttached = true;

  mongoose.plugin((schema) => {
    const ops = ['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'countDocuments', 'aggregate'];
    ops.forEach((op) => {
      schema.pre(op, function () {
        this._perfStart = Date.now();
      });
      schema.post(op, function () {
        const ms = Date.now() - (this._perfStart || Date.now());
        if (ms > SLOW_QUERY_THRESHOLD_MS) {
          const collectionName = this?.mongooseCollection?.name || 'unknown';
          console.warn(`[DB SLOW] ${op} on '${collectionName}' took ${ms}ms`);
        }
      });
    });
  });
}

// ─── Database connection ──────────────────────────────────────────────────────
function getMongoConfig() {
  const uri = process.env.MONGO_URI;
  const allowLocal = process.env.ALLOW_LOCAL_MONGO === 'true';

  if (!uri) {
    throw new Error('MONGO_URI is required. Set it to your MongoDB Atlas connection string.');
  }

  const pointsToAtlas = uri.startsWith('mongodb+srv://') || uri.includes('mongodb.net');
  if (!allowLocal && !pointsToAtlas) {
    throw new Error('MONGO_URI must point to MongoDB Atlas. Set ALLOW_LOCAL_MONGO=true only for intentional local development.');
  }

  return {
    uri,
    dbName: process.env.MONGO_DB_NAME || DEFAULT_DB_NAME,
  };
}

const connectDB = async () => {
  attachPerformancePlugin();
  const { uri, dbName } = getMongoConfig();

  const options = {
    dbName,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`[DB] Connected → ${conn.connection.host} (pool: ${options.maxPoolSize})`);
  } catch (error) {
    console.error(`[DB] Connection failed: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => console.log('[DB] Mongoose connected'));
  mongoose.connection.on('error', (err) => console.error(`[DB] Mongoose error: ${err.message}`));
  mongoose.connection.on('disconnected', () => console.warn('[DB] Mongoose disconnected — will attempt reconnect'));
  mongoose.connection.on('reconnected', () => console.log('[DB] Mongoose reconnected'));
};

export default connectDB;
