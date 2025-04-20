const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const baseUrl = process.env['BASE_URL'];

if (!baseUrl) {
  throw new Error('BASE_URL is not set in .env file');
}

const envFileContent = `
export const environment = {
  BASE_URL: "${baseUrl}",
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
