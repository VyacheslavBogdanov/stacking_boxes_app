import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from './BaseInput.vue';

describe('BaseInput', () => {
	it('рендерит input-элемент', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '' },
		});
		expect(wrapper.find('[data-test="input-field"]').exists()).toBe(true);
	});

	it('рендерит label при передаче пропа', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', label: 'Имя' },
		});
		expect(wrapper.find('[data-test="input-label"]').text()).toBe('Имя');
	});

	it('не рендерит label без пропа', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '' },
		});
		expect(wrapper.find('[data-test="input-label"]').exists()).toBe(false);
	});

	it('устанавливает placeholder', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', placeholder: 'Введите текст' },
		});
		expect(wrapper.find('[data-test="input-field"]').attributes('placeholder')).toBe(
			'Введите текст',
		);
	});

	it('устанавливает type по умолчанию text', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '' },
		});
		expect(wrapper.find('[data-test="input-field"]').attributes('type')).toBe('text');
	});

	it('устанавливает переданный type', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', type: 'number' },
		});
		expect(wrapper.find('[data-test="input-field"]').attributes('type')).toBe('number');
	});

	it('связывает id с label через for/id', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', label: 'Имя', id: 'name-input' },
		});
		expect(wrapper.find('[data-test="input-label"]').attributes('for')).toBe('name-input');
		expect(wrapper.find('[data-test="input-field"]').attributes('id')).toBe('name-input');
	});

	it('рендерит сообщение об ошибке при error', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', error: 'Обязательное поле' },
		});
		expect(wrapper.find('[data-test="input-error"]').text()).toBe('Обязательное поле');
	});

	it('не рендерит сообщение об ошибке без error', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '' },
		});
		expect(wrapper.find('[data-test="input-error"]').exists()).toBe(false);
	});

	it('добавляет класс --error на поле ввода', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', error: 'Ошибка' },
		});
		expect(wrapper.find('[data-test="input-field"]').classes()).toContain(
			'base-input__field--error',
		);
	});

	it('устанавливает value из modelValue', () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: 'hello' },
		});
		expect((wrapper.find('[data-test="input-field"]').element as HTMLInputElement).value).toBe(
			'hello',
		);
	});

	it('эмитит update:model-value при вводе', async () => {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '' },
		});
		await wrapper.find('[data-test="input-field"]').setValue('test');
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['test']);
	});
});
