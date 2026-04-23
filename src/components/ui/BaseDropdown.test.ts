import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseDropdown from './BaseDropdown.vue';

const MOCK_OPTIONS = [
	{ value: 'a', label: 'Опция A' },
	{ value: 'b', label: 'Опция B' },
	{ value: 'c', label: 'Опция C' },
];

describe('BaseDropdown', () => {
	it('рендерит select-элемент', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		expect(wrapper.find('[data-test="dropdown-select"]').exists()).toBe(true);
	});

	it('рендерит label при передаче пропа', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, label: 'Марка' },
		});
		expect(wrapper.find('[data-test="dropdown-label"]').text()).toBe('Марка');
	});

	it('не рендерит label без пропа', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		expect(wrapper.find('[data-test="dropdown-label"]').exists()).toBe(false);
	});

	it('рендерит placeholder как disabled option', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, placeholder: 'Выберите' },
		});
		const placeholderOption = wrapper.find('option[disabled]');
		expect(placeholderOption.exists()).toBe(true);
		expect(placeholderOption.text()).toBe('Выберите');
		expect(placeholderOption.attributes('value')).toBe('');
	});

	it('не рендерит placeholder без пропа', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		expect(wrapper.find('option[disabled]').exists()).toBe(false);
	});

	it('рендерит переданные options', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		const options = wrapper.findAll('option');
		expect(options).toHaveLength(3);
		expect(options[0].text()).toBe('Опция A');
		expect(options[0].attributes('value')).toBe('a');
		expect(options[1].text()).toBe('Опция B');
		expect(options[2].text()).toBe('Опция C');
	});

	it('рендерит сообщение об ошибке при error', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, error: 'Выберите значение' },
		});
		expect(wrapper.find('[data-test="dropdown-error"]').text()).toBe('Выберите значение');
	});

	it('не рендерит сообщение об ошибке без error', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		expect(wrapper.find('[data-test="dropdown-error"]').exists()).toBe(false);
	});

	it('добавляет класс --error на select', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, error: 'Ошибка' },
		});
		expect(wrapper.find('[data-test="dropdown-select"]').classes()).toContain(
			'base-dropdown__select--error',
		);
	});

	it('устанавливает выбранное значение из modelValue', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: 'b', options: MOCK_OPTIONS },
		});
		expect(
			(wrapper.find('[data-test="dropdown-select"]').element as HTMLSelectElement).value,
		).toBe('b');
	});

	it('связывает id с label через for/id', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, label: 'Марка', id: 'grade-select' },
		});
		expect(wrapper.find('[data-test="dropdown-label"]').attributes('for')).toBe('grade-select');
		expect(wrapper.find('[data-test="dropdown-select"]').attributes('id')).toBe('grade-select');
	});

	it('эмитит update:model-value при выборе', async () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});
		await wrapper.find('[data-test="dropdown-select"]').setValue('c');
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['c']);
	});
});
