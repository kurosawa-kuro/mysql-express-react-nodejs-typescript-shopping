import request from 'supertest';
import app from '../index'; // Expressアプリケーションをインポートします

describe('GET /', () => {
    it('responds with a json message', async () => {
        const response = await request(app).get('/');
        console.log('response: ', response);
        expect(response.status).toBe(200);
        expect(response.text).toEqual('API is running....');
    });
});
