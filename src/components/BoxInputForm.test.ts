import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import BoxInputForm from './BoxInputForm.vue';

const mockGrades = [
	{ id: '1', name: 'Т-21' },
	{ id: '2', name: 'Т-22' },
];

vi.mock('@/api/cardboardGradeApi', () => ({
	getAll: vi.fn().mockResolvedValue([
		{ id: '1', name: 'Т-21' },
		{ id: '2', name: 'Т-22' },
	]),
	create: vi.fn(),
	update: vi.fn(),
	remove: vi.fn(),
}));

describe('BoxInputForm', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('рендеринг', () => {
		it('рендерит форму с атрибутом data-test', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="box-input-form"]').exists()).toBe(true);
		});

		it('рендерит поле ввода длины', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="length-input"]').exists()).toBe(true);
		});

		it('рендерит поле ввода ширины', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="width-input"]').exists()).toBe(true);
		});

		it('рендерит поле ввода высоты', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="height-input"]').exists()).toBe(true);
		});

		it('рендерит поле ввода массы брутто', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="gross-weight-input"]').exists()).toBe(true);
		});

		it('рендерит выпадающий список марок картона', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="grade-dropdown"]').exists()).toBe(true);
		});

		it('рендерит кнопку «Рассчитать»', () => {
			const wrapper = mount(BoxInputForm);

			const button = wrapper.find('[data-test="submit-button"]');
			expect(button.exists()).toBe(true);
			expect(button.text()).toBe('Рассчитать');
		});
	});

	describe('загрузка марок картона', () => {
		it('загружает марки картона при монтировании', async () => {
			const { getAll } = await import('@/api/cardboardGradeApi');

			mount(BoxInputForm);
			await flushPromises();

			expect(getAll).toHaveBeenCalled();
		});

		it('отображает марки в выпадающем списке после загрузки', async () => {
			const wrapper = mount(BoxInputForm);
			await flushPromises();

			const options = wrapper
				.find('[data-test="grade-dropdown"]')
				.findAll('option')
				.filter((o) => o.attributes('disabled') === undefined);

			expect(options).toHaveLength(mockGrades.length);
			expect(options[0].text()).toBe('Т-21');
			expect(options[1].text()).toBe('Т-22');
		});
	});

	describe('валидация', () => {
		async function submitEmpty(wrapper: ReturnType<typeof mount>) {
			await wrapper.find('[data-test="box-input-form"]').trigger('submit');
		}

		it('показывает ошибку для пустого поля длины при отправке', async () => {
			const wrapper = mount(BoxInputForm);
			await submitEmpty(wrapper);

			const field = wrapper.find('[data-test="length-input"]');
			expect(field.find('[data-test="input-error"]').exists()).toBe(true);
		});

		it('показывает ошибку для пустого поля ширины при отправке', async () => {
			const wrapper = mount(BoxInputForm);
			await submitEmpty(wrapper);

			const field = wrapper.find('[data-test="width-input"]');
			expect(field.find('[data-test="input-error"]').exists()).toBe(true);
		});

		it('показывает ошибку для пустого поля высоты при отправке', async () => {
			const wrapper = mount(BoxInputForm);
			await submitEmpty(wrapper);

			const field = wrapper.find('[data-test="height-input"]');
			expect(field.find('[data-test="input-error"]').exists()).toBe(true);
		});

		it('показывает ошибку для пустого поля массы брутто при отправке', async () => {
			const wrapper = mount(BoxInputForm);
			await submitEmpty(wrapper);

			const field = wrapper.find('[data-test="gross-weight-input"]');
			expect(field.find('[data-test="input-error"]').exists()).toBe(true);
		});

		it('показывает ошибку при невыбранной марке картона', async () => {
			const wrapper = mount(BoxInputForm);
			await submitEmpty(wrapper);

			const field = wrapper.find('[data-test="grade-dropdown"]');
			expect(field.find('[data-test="dropdown-error"]').exists()).toBe(true);
		});

		it('показывает ошибку для отрицательного значения', async () => {
			const wrapper = mount(BoxInputForm);
			await flushPromises();

			const input = wrapper.find('[data-test="length-input"]').find('input');
			await input.setValue('-5');
			await wrapper.find('[data-test="box-input-form"]').trigger('submit');

			const field = wrapper.find('[data-test="length-input"]');
			expect(field.find('[data-test="input-error"]').text()).toContain('больше 0');
		});

		it('показывает ошибку для нулевого значения', async () => {
			const wrapper = mount(BoxInputForm);
			await flushPromises();

			const input = wrapper.find('[data-test="length-input"]').find('input');
			await input.setValue('0');
			await wrapper.find('[data-test="box-input-form"]').trigger('submit');

			const field = wrapper.find('[data-test="length-input"]');
			expect(field.find('[data-test="input-error"]').text()).toContain('больше 0');
		});

		it('не показывает ошибки до первой отправки', () => {
			const wrapper = mount(BoxInputForm);

			expect(wrapper.find('[data-test="input-error"]').exists()).toBe(false);
			expect(wrapper.find('[data-test="dropdown-error"]').exists()).toBe(false);
		});
	});

	describe('отправка формы', () => {
		async function fillForm(wrapper: ReturnType<typeof mount>) {
			await flushPromises();

			const lengthInput = wrapper.find('[data-test="length-input"]').find('input');
			const widthInput = wrapper.find('[data-test="width-input"]').find('input');
			const heightInput = wrapper.find('[data-test="height-input"]').find('input');
			const grossWeightInput = wrapper.find('[data-test="gross-weight-input"]').find('input');
			const gradeSelect = wrapper.find('[data-test="grade-dropdown"]').find('select');

			await lengthInput.setValue('300');
			await widthInput.setValue('200');
			await heightInput.setValue('150');
			await grossWeightInput.setValue('10');
			await gradeSelect.setValue('1');
		}

		it('эмитит submit с BoxParams при валидной форме', async () => {
			const wrapper = mount(BoxInputForm);
			await fillForm(wrapper);
			await wrapper.find('[data-test="box-input-form"]').trigger('submit');

			expect(wrapper.emitted('submit')).toBeTruthy();
			expect(wrapper.emitted('submit')![0]).toEqual([
				{
					length: 300,
					width: 200,
					height: 150,
					grossWeight: 10,
					gradeId: '1',
				},
			]);
		});

		it('не эмитит submit при невалидной форме', async () => {
			const wrapper = mount(BoxInputForm);
			await wrapper.find('[data-test="box-input-form"]').trigger('submit');

			expect(wrapper.emitted('submit')).toBeFalsy();
		});
	});
});
