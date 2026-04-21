import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton', () => {
	it('рендерит button-элемент', () => {
		const wrapper = mount(BaseButton);
		expect(wrapper.find('button').exists()).toBe(true);
	});

	it('рендерит содержимое слота', () => {
		const wrapper = mount(BaseButton, {
			slots: { default: 'Отправить' },
		});
		expect(wrapper.text()).toBe('Отправить');
	});

	it('устанавливает type по умолчанию button', () => {
		const wrapper = mount(BaseButton);
		expect(wrapper.find('button').attributes('type')).toBe('button');
	});

	it('устанавливает переданный type', () => {
		const wrapper = mount(BaseButton, {
			props: { type: 'submit' },
		});
		expect(wrapper.find('button').attributes('type')).toBe('submit');
	});

	it('применяет класс primary по умолчанию', () => {
		const wrapper = mount(BaseButton);
		expect(wrapper.find('button').classes()).toContain('base-button--primary');
	});

	it('применяет класс secondary', () => {
		const wrapper = mount(BaseButton, {
			props: { variant: 'secondary' },
		});
		expect(wrapper.find('button').classes()).toContain('base-button--secondary');
	});

	it('применяет класс danger', () => {
		const wrapper = mount(BaseButton, {
			props: { variant: 'danger' },
		});
		expect(wrapper.find('button').classes()).toContain('base-button--danger');
	});

	it('устанавливает атрибут disabled и добавляет класс --disabled', () => {
		const wrapper = mount(BaseButton, {
			props: { disabled: true },
		});
		const button = wrapper.find('button');
		expect(button.attributes('disabled')).toBeDefined();
		expect(button.classes()).toContain('base-button--disabled');
	});

	it('не эмитит click при disabled', async () => {
		const wrapper = mount(BaseButton, {
			props: { disabled: true },
		});
		await wrapper.find('button').trigger('click');
		expect(wrapper.emitted('click')).toBeUndefined();
	});

	it('эмитит click при нажатии', async () => {
		const wrapper = mount(BaseButton);
		await wrapper.find('button').trigger('click');
		expect(wrapper.emitted('click')).toHaveLength(1);
	});
});
