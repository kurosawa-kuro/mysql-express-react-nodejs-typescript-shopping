// frontend\src\tests\e2e\auth\register.js

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
        const expectedName = 'john10';
        const email = 'john10@example.com';
        const password = '123456';

        await page.goto('http://localhost:3000/register');
        await page.fill('input[placeholder="Enter name"]', expectedName);
        await page.fill('input[placeholder="Enter email"]', email);
        await page.fill('input[placeholder="Enter password"]', password);
        await page.fill('input[placeholder="Confirm password"]', password);
        await page.click('button:has-text("Register")');

        await page.waitForSelector('span[data-testid="user-info-name"]');
        const timestamp = new Date().getTime();
        const screenshotPath = `./src/tests/screenshot/screenshot_${timestamp}.png`;

        await page.screenshot({ path: screenshotPath });
        const nameElement = await page.$('span[data-testid="user-info-name"]');
        const actualName = await nameElement.textContent();

        expect(actualName).toBe(expectedName);
    });
});
