import { Base64DecryptMiddleware } from './base64.decrypt.middleware';

describe('Base64DecryptMiddleware', () => {
  it('should be defined', () => {
    expect(new Base64DecryptMiddleware()).toBeDefined();
  });
});
