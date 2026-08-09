import mongoose from 'mongoose';

// ─── Slow-query performance monitor ──────────────────────────────────────────
const SLOW_QUERY_THRESHOLD_MS = 200;

function attachPerformancePlugin() {
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
const connectDB = async () => {
  attachPerformancePlugin();

  const options = {
    maxPoolSize: 10,              // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Timeout if no server found in 5s
    socketTimeoutMS: 45000,       // Close sockets after 45s of inactivity
  };

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/multivendor', options);
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
