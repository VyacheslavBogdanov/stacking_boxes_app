import { expect, test, type Page } from '@playwright/test';

async function openCleanApp(page: Page): Promise<void> {
	await page.goto('/');
	await page.evaluate(() => {
		localStorage.clear();
	});
	await page.reload();
}

async function selectFirstGrade(page: Page): Promise<void> {
	const dropdown = page.getByTestId('grade-dropdown');

	await dropdown.getByTestId('dropdown-select').click();
	await dropdown.getByTestId('dropdown-option').first().click();
}

async function calculate(page: Page, length: number): Promise<void> {
	await page.getByLabel('Длина, мм').fill(String(length));
	await page.getByLabel('Ширина, мм').fill('305');
	await page.getByLabel('Высота, мм').fill('110');
	await page.getByLabel('Масса брутто, кг').fill('2');

	await selectFirstGrade(page);
	await page.getByRole('button', { name: 'Рассчитать' }).click();

	await expect(page.getByTestId('results-content')).toBeVisible();
}

test.describe('calculation history', () => {
	test('расчёт добавляется в историю, результат можно закрыть и открыть из истории', async ({
		page,
	}) => {
		await openCleanApp(page);

		await calculate(page, 447);

		await expect(page.getByText('История')).toBeVisible();
		await expect(page.getByTestId('history-details')).toBeVisible();
		await expect(page.getByTestId('history-details')).toContainText('447 мм');

		await page.getByLabel('Закрыть результаты расчёта').click();

		await expect(page.getByTestId('results-content')).toHaveCount(0);

		await page.locator('.calculation-history__button').first().click();

		await expect(page.getByTestId('results-content')).toBeVisible();
		await expect(page.getByTestId('history-details')).toContainText('447 мм');
	});

	test('история хранит максимум 10 расчётов и сохраняется после обновления страницы', async ({
		page,
	}) => {
		await openCleanApp(page);

		for (let index = 0; index < 11; index += 1) {
			await calculate(page, 400 + index);
		}

		await expect(page.locator('.calculation-history__button')).toHaveCount(10);

		await page.reload();

		await expect(page.locator('.calculation-history__button')).toHaveCount(10);
		await expect(page.getByText('410×305×110')).toBeVisible();
		await expect(page.getByText('400×305×110')).toHaveCount(0);
	});
});
