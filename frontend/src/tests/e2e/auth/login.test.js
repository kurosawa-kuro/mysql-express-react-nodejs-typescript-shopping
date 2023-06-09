// frontend\src\tests\e2e\auth\login.test.js

const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');

test.describe('React App Test', () => {
    let browser;
    let page;

    test.beforeAll(async () => {
        browser = await chromium.launch();
    });

    test.afterAll(async () => {
        await browser.close();
    });

    test.beforeEach(async () => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display the home page', async () => {
        const expectedName = 'john';
        const email = 'john@email.com';
        const password = '123456';

        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.getByTestId('login').click();

        await page.waitForSelector('span[data-testid="user-info-name"]');
        await page.screenshot({ path: 'screenshot.png' });
        const nameElement = await page.$('span[data-testid="user-info-name"]');
        const actualName = await nameElement.textContent();

        expect(actualName).toBe(expectedName);
    });
});
