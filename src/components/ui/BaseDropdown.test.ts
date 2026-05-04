import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseDropdown from './BaseDropdown.vue';

const MOCK_OPTIONS = [
	{ value: 'a', label: 'Опция A' },
	{ value: 'b', label: 'Опция B' },
	{ value: 'c', label: 'Опция C' },
];

describe('BaseDropdown', () => {
	it('рендерит кнопку dropdown', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});

		const button = wrapper.find('[data-test="dropdown-select"]');

		expect(button.exists()).toBe(true);
		expect(button.element.tagName).toBe('BUTTON');
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

	it('рендерит placeholder только в кнопке', async () => {
		const wrapper = mount(BaseDropdown, {
			props: {
				modelValue: '',
				options: MOCK_OPTIONS,
				placeholder: 'Выберите',
			},
		});

		expect(wrapper.find('[data-test="dropdown-select"]').text()).toContain(
			'Выберите',
		);

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');

		expect(wrapper.find('[data-test="dropdown-placeholder"]').exists()).toBe(
			false,
		);
	});

	it('не рендерит placeholder без пропа', async () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');

		expect(wrapper.find('[data-test="dropdown-placeholder"]').exists()).toBe(
			false,
		);
	});

	it('рендерит переданные options', async () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');

		const options = wrapper.findAll('[data-test="dropdown-option"]');

		expect(options).toHaveLength(3);
		expect(options[0].text()).toContain('Опция A');
		expect(options[1].text()).toContain('Опция B');
		expect(options[2].text()).toContain('Опция C');
	});

	it('рендерит сообщение об ошибке при error', () => {
		const wrapper = mount(BaseDropdown, {
			props: {
				modelValue: '',
				options: MOCK_OPTIONS,
				error: 'Выберите значение',
			},
		});

		expect(wrapper.find('[data-test="dropdown-error"]').text()).toBe(
			'Выберите значение',
		);
	});

	it('не рендерит сообщение об ошибке без error', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});

		expect(wrapper.find('[data-test="dropdown-error"]').exists()).toBe(false);
	});

	it('добавляет класс --error на кнопку dropdown', () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS, error: 'Ошибка' },
		});

		expect(wrapper.find('[data-test="dropdown-select"]').classes()).toContain(
			'base-dropdown__button--error',
		);
	});

	it('отображает выбранное значение из modelValue', async () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: 'b', options: MOCK_OPTIONS },
		});

		expect(wrapper.find('[data-test="dropdown-select"]').text()).toContain(
			'Опция B',
		);

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');

		expect(
			wrapper.findAll('[data-test="dropdown-option"]')[1].classes(),
		).toContain('base-dropdown__option--selected');
	});

	it('связывает id с label через for/id', () => {
		const wrapper = mount(BaseDropdown, {
			props: {
				modelValue: '',
				options: MOCK_OPTIONS,
				label: 'Марка',
				id: 'grade-select',
			},
		});

		expect(wrapper.find('[data-test="dropdown-label"]').attributes('for')).toBe(
			'grade-select',
		);
		expect(wrapper.find('[data-test="dropdown-select"]').attributes('id')).toBe(
			'grade-select',
		);
	});

	it('эмитит update:model-value при выборе option', async () => {
		const wrapper = mount(BaseDropdown, {
			props: { modelValue: '', options: MOCK_OPTIONS },
		});

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');
		await wrapper.findAll('[data-test="dropdown-option"]')[2].trigger('click');

		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['c']);
	});

	it('закрывает меню при клике вне dropdown', async () => {
		const wrapper = mount(BaseDropdown, {
			attachTo: document.body,
			props: {
				modelValue: '',
				options: MOCK_OPTIONS,
			},
		});

		await wrapper.find('[data-test="dropdown-select"]').trigger('click');

		expect(wrapper.find('[data-test="dropdown-menu"]').exists()).toBe(true);

		document.body.click();
		await wrapper.vm.$nextTick();

		expect(wrapper.find('[data-test="dropdown-menu"]').exists()).toBe(false);

		wrapper.unmount();
	});
});
