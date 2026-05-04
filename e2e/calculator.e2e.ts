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

async function fillCalculatorForm(page: Page): Promise<void> {
	await page.getByLabel('Длина, мм').fill('447');
	await page.getByLabel('Ширина, мм').fill('305');
	await page.getByLabel('Высота, мм').fill('110');
	await page.getByLabel('Масса брутто, кг').fill('2');

	await selectFirstGrade(page);
}

test.describe('calculator', () => {
	test('заполнение формы → получение результата', async ({ page }) => {
		await openCleanApp(page);

		await fillCalculatorForm(page);
		await page.getByRole('button', { name: 'Рассчитать' }).click();

		await expect(page.getByTestId('results-content')).toBeVisible();
		await expect(page.getByTestId('max-stack-height')).toBeVisible();
		await expect(page.getByTestId('row-count')).toBeVisible();
		await expect(page.getByTestId('max-weight-per-box')).toBeVisible();

		await expect(page.getByTestId('max-stack-height')).toContainText('мм');
		await expect(page.getByTestId('row-count')).toContainText('шт');
		await expect(page.getByTestId('max-weight-per-box')).toContainText('кг');
	});
});
