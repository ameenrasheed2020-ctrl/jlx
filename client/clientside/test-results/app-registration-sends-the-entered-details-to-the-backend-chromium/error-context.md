# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> registration sends the entered details to the backend
- Location: tests\e2e\app.spec.js:52:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://127.0.0.1:5173/login"
Received: "http://127.0.0.1:5173/register"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://127.0.0.1:5173/register"

```

```yaml
- heading "welcome to JLX" [level=2]
- heading "where you find yor stuffs" [level=2]
- text: Name
- textbox "Enter your name"
- text: Email Address
- textbox "Enter your email"
- text: Age
- spinbutton
- text: Phone Number
- textbox "Enter phone number"
- text: Password
- textbox "Create a password"
- button "Create Account"
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | const products = [
  4   |   {
  5   |     _id: 'product-1',
  6   |     productname: 'Test Phone',
  7   |     productdescription: 'A dependable test phone',
  8   |     productprice: 12000,
  9   |     productimage: '',
  10  |     category: 'Mobiles',
  11  |   },
  12  |   {
  13  |     _id: 'product-2',
  14  |     productname: 'City Bike',
  15  |     productdescription: 'A quick ride for local trips',
  16  |     productprice: 4500,
  17  |     productimage: '',
  18  |     category: 'Bikes',
  19  |   },
  20  | ];
  21  | 
  22  | async function mockProducts(page) {
  23  |   await page.route('http://localhost:6500/product/getproducts', async (route) => {
  24  |     await route.fulfill({
  25  |       status: 200,
  26  |       contentType: 'application/json',
  27  |       body: JSON.stringify(products),
  28  |     });
  29  |   });
  30  | }
  31  | 
  32  | test('home page shows products from the backend', async ({ page }) => {
  33  |   await mockProducts(page);
  34  | 
  35  |   await page.goto('/');
  36  | 
  37  |   await expect(page.getByText('Fresh recommendations')).toBeVisible();
  38  |   await expect(page.getByText('Test Phone')).toBeVisible();
  39  |   await expect(page.getByText('City Bike')).toBeVisible();
  40  | });
  41  | 
  42  | test('home page filters products by search text', async ({ page }) => {
  43  |   await mockProducts(page);
  44  | 
  45  |   await page.goto('/');
  46  |   await page.getByPlaceholder('Find Cars, Mobile Phones and more...').fill('phone');
  47  | 
  48  |   await expect(page.getByText('Test Phone')).toBeVisible();
  49  |   await expect(page.getByText('City Bike')).not.toBeVisible();
  50  | });
  51  | 
  52  | test('registration sends the entered details to the backend', async ({ page }) => {
  53  |   let requestBody;
  54  | 
  55  |   await page.route('http://localhost:6500/auth/register', async (route) => {
  56  |     requestBody = route.request().postDataJSON();
  57  |     await route.fulfill({
  58  |       status: 201,
  59  |       contentType: 'application/json',
  60  |       body: JSON.stringify({ message: 'Registered' }),
  61  |     });
  62  |   });
  63  | 
  64  |   await page.goto('/register');
  65  |   await page.getByPlaceholder('Enter your name').fill('Ameen');
  66  |   await page.getByPlaceholder('Enter your email').fill('ameen@example.com');
  67  |   await page.getByPlaceholder('Enter your age').fill('24');
  68  |   await page.getByPlaceholder('Enter phone number').fill('9876543210');
  69  |   await page.getByPlaceholder('Create a password').fill('secret123');
  70  |   await page.getByRole('button', { name: 'Create Account' }).click();
  71  | 
  72  |   await expect.poll(() => requestBody).toEqual({
  73  |     Name: 'Ameen',
  74  |     email: 'ameen@example.com',
  75  |     age: '24',
  76  |     phonenumber: '9876543210',
  77  |     password: 'secret123',
  78  |   });
> 79  |   await expect(page).toHaveURL('/login');
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  80  | });
  81  | 
  82  | test('login stores auth data and returns to the home page', async ({ page }) => {
  83  |   await mockProducts(page);
  84  | 
  85  |   await page.route('http://localhost:6500/auth/login', async (route) => {
  86  |     await route.fulfill({
  87  |       status: 200,
  88  |       contentType: 'application/json',
  89  |       body: JSON.stringify({
  90  |         token: 'test-token',
  91  |         user: { _id: 'user-1' },
  92  |       }),
  93  |     });
  94  |   });
  95  | 
  96  |   page.once('dialog', async (dialog) => {
  97  |     expect(dialog.message()).toContain('Login successful');
  98  |     await dialog.accept();
  99  |   });
  100 | 
  101 |   await page.goto('/login');
  102 |   await page.getByPlaceholder('Enter your email').fill('ameen@example.com');
  103 |   await page.getByPlaceholder('Enter your password').fill('secret123');
  104 |   await page.getByRole('button', { name: 'Login' }).click();
  105 | 
  106 |   await expect(page).toHaveURL('/');
  107 |   await expect(page.getByText('Fresh recommendations')).toBeVisible();
  108 |   await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBe('test-token');
  109 |   await expect(page.evaluate(() => localStorage.getItem('userId'))).resolves.toBe('user-1');
  110 | });
  111 | 
```