import * as dotenv from 'dotenv';

dotenv.config();

const APPCONFIGS = {
  PORT: process.env['PORT'] || 8000,
  BASE_PATH: '/api',
  BASE_URL: process.env['BASE_URL'],
  CONNECTION_STRING: process.env['CONNECTION_STRING'],
};

export default APPCONFIGS;
