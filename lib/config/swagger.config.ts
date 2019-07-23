import * as path from 'path';
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apollo api',
      version: '1.0.0',
    }
  },
  apis: [path.join(__dirname, '../routers/*.ts')]
}