import { expect, test } from '@playwright/test';

const products = [
  {
    _id: 'product-1',
    productname: 'Test Phone',
    productdescription: 'A dependable test phone',
    productprice: 12000,
    productimage: '',
    category: 'Mobiles',
  },
  {
    _id: 'product-2',
    productname: 'City Bike',
    productdescription: 'A quick ride for local trips',
    productprice: 4500,
    productimage: '',
    category: 'Bikes',
  },
];

async function mockProducts(page) {
  await page.route('http://localhost:6500/product/getproducts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(products),
    });
  });
}

test('home page shows products from the backend', async ({ page }) => {
  await mockProducts(page);

  await page.goto('/');

  await expect(page.getByText('Fresh recommendations')).toBeVisible();
  await expect(page.getByText('Test Phone')).toBeVisible();
  await expect(page.getByText('City Bike')).toBeVisible();
});

test('home page filters products by search text', async ({ page }) => {
  await mockProducts(page);

  await page.goto('/');
  await page.getByPlaceholder('Find Cars, Mobile Phones and more...').fill('phone');

  await expect(page.getByText('Test Phone')).toBeVisible();
  await expect(page.getByText('City Bike')).not.toBeVisible();
});

test('registration sends the entered details to the backend', async ({ page }) => {
  let requestBody;

  await page.route('http://localhost:6500/auth/register', async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Registered' }),
    });
  });

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Registration successful');
    await dialog.accept();
  });

  await page.goto('/register');
  await page.getByPlaceholder('Enter your name').fill('Ameen');
  await page.getByPlaceholder('Enter your email').fill('ameen@example.com');
  await page.getByPlaceholder('Enter your age').fill('24');
  await page.getByPlaceholder('Enter phone number').fill('9876543210');
  await page.getByPlaceholder('Create a password').fill('secret123');
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect.poll(() => requestBody).toEqual({
    Name: 'Ameen',
    email: 'ameen@example.com',
    age: '24',
    phonenumber: '9876543210',
    password: 'secret123',
  });
});

test('login stores auth data and returns to the home page', async ({ page }) => {
  await mockProducts(page);

  await page.route('http://localhost:6500/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'test-token',
        user: { _id: 'user-1' },
      }),
    });
  });

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Login successful');
    await dialog.accept();
  });

  await page.goto('/login');
  await page.getByPlaceholder('Enter your email').fill('ameen@example.com');
  await page.getByPlaceholder('Enter your password').fill('secret123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByText('Fresh recommendations')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe('test-token');
  await expect(page.evaluate(() => localStorage.getItem('userId'))).resolves.toBe('user-1');
});
