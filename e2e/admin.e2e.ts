import { expect, test, type Page } from '@playwright/test';

async function openCleanApp(page: Page): Promise<void> {
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.clear();
	});
	await page.reload();
}

async function openAdminLogin(page: Page): Promise<void> {
	await page.getByRole('button', { name: 'Вход администратора' }).click();
	await expect(page.getByRole('heading', { name: 'Вход администратора' })).toBeVisible();
}

async function loginAsAdmin(page: Page): Promise<void> {
	await openAdminLogin(page);

	await page.locator('#username').fill('admin');
	await page.locator('#password').fill('admin');
	await page.getByRole('button', { name: 'Войти' }).click();

	await expect(page.getByText('Админ-панель')).toBeVisible();
}

test.describe('admin panel', () => {
	test('админ входит, создаёт, редактирует и удаляет марку картона', async ({
		page,
	}) => {
		await openCleanApp(page);
		await loginAsAdmin(page);

		const gradeName = `E2E-${Date.now()}`;
		const updatedGradeName = `${gradeName}-updated`;

		await page.getByLabel('Марка картона').fill(gradeName);
		await page.getByLabel('Толщина').fill('5');
		await page.getByLabel('Сопротивление сжатию').fill('5.2');

		const createResponsePromise = page.waitForResponse((response) => {
			return response.url().includes('/grades') && response.request().method() === 'POST';
		});

		await page.getByRole('button', { name: 'Добавить' }).click();

		const createResponse = await createResponsePromise;

		expect(createResponse.ok()).toBe(true);

		await expect(page.getByTestId('admin-success-message')).toHaveText('Марка добавлена');

		const createdRow = page.locator('tr').filter({ hasText: gradeName });
		await expect(createdRow).toBeVisible();
		await expect(createdRow).toContainText('5');
		await expect(createdRow).toContainText('5.2');

		await createdRow.getByRole('button', { name: 'Редактировать' }).click();

		await expect(page.getByLabel('Марка картона')).toHaveValue(gradeName);
		await expect(page.getByLabel('Толщина')).toHaveValue('5');
		await expect(page.getByLabel('Сопротивление сжатию')).toHaveValue('5.2');

		await page.getByLabel('Марка картона').fill(updatedGradeName);
		await page.getByLabel('Толщина').fill('5.1');
		await page.getByLabel('Сопротивление сжатию').fill('5.3');

		const updateResponsePromise = page.waitForResponse((response) => {
			return response.url().includes('/grades/') && response.request().method() === 'PUT';
		});

		await page.getByRole('button', { name: 'Сохранить' }).click();

		const updateResponse = await updateResponsePromise;

		if (!updateResponse.ok()) {
			const responseText = await updateResponse.text();

			throw new Error(
				[
					'PUT /grades failed',
					`status: ${updateResponse.status()}`,
					`url: ${updateResponse.url()}`,
					`body: ${responseText}`,
				].join('\n'),
			);
		}

		expect(updateResponse.ok()).toBe(true);

		await expect(page.getByTestId('admin-success-message')).toHaveText('Марка обновлена');

		const updatedRow = page.locator('tr').filter({ hasText: updatedGradeName });
		await expect(updatedRow).toBeVisible();
		await expect(updatedRow).toContainText('5.1');
		await expect(updatedRow).toContainText('5.3');

		page.once('dialog', async (dialog) => {
			expect(dialog.message()).toBe('Удалить марку картона?');
			await dialog.accept();
		});

		const deleteResponsePromise = page.waitForResponse((response) => {
			return response.url().includes('/grades/') && response.request().method() === 'DELETE';
		});

		await updatedRow.getByRole('button', { name: 'Удалить' }).click();

		const deleteResponse = await deleteResponsePromise;

		expect(deleteResponse.ok()).toBe(true);

		await expect(page.getByTestId('admin-success-message')).toHaveText('Марка удалена');
		await expect(page.locator('tr').filter({ hasText: updatedGradeName })).toHaveCount(0);
	});

	test('админ остаётся авторизованным после обновления и выходит через logout', async ({
		page,
	}) => {
		await openCleanApp(page);
		await loginAsAdmin(page);

		await page.reload();

		await expect(page.getByText('Админ-панель')).toBeVisible();

		await page.getByRole('button', { name: 'Выйти' }).click();

		await expect(
			page.getByRole('button', { name: 'Вход администратора' }),
		).toBeVisible();

		await page.reload();

		await expect(
			page.getByRole('button', { name: 'Вход администратора' }),
		).toBeVisible();
	});
});
