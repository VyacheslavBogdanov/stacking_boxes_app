import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ResultsDisplay from './ResultsDisplay.vue';
import type { CalculationResult } from '@/types';

const mockResult: CalculationResult = {
	maxStackHeight: 1500,
	rowCount: 5,
	maxWeightPerBox: 12.5,
};

describe('ResultsDisplay', () => {
	describe('состояние загрузки', () => {
		it('отображает индикатор загрузки при isLoading = true', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: null, isLoading: true },
			});

			expect(wrapper.find('[data-test="results-loading"]').exists()).toBe(true);
		});

		it('скрывает результаты при isLoading = true', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: mockResult, isLoading: true },
			});

			expect(wrapper.find('[data-test="results-content"]').exists()).toBe(false);
		});

		it('скрывает пустое состояние при isLoading = true', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: null, isLoading: true },
			});

			expect(wrapper.find('[data-test="results-empty"]').exists()).toBe(false);
		});
	});

	describe('пустое состояние', () => {
		it('отображает сообщение при result = null', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: null, isLoading: false },
			});

			expect(wrapper.find('[data-test="results-empty"]').exists()).toBe(true);
		});

		it('скрывает индикатор загрузки', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: null, isLoading: false },
			});

			expect(wrapper.find('[data-test="results-loading"]').exists()).toBe(false);
		});

		it('скрывает блок результатов', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: null, isLoading: false },
			});

			expect(wrapper.find('[data-test="results-content"]').exists()).toBe(false);
		});
	});

	describe('отображение результатов', () => {
		it('отображает максимальную высоту штабеля', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: mockResult, isLoading: false },
			});

			const el = wrapper.find('[data-test="max-stack-height"]');
			expect(el.exists()).toBe(true);
			expect(el.text()).toContain('1500');
			expect(el.text()).toContain('мм');
		});

		it('отображает количество рядов', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: mockResult, isLoading: false },
			});

			const el = wrapper.find('[data-test="row-count"]');
			expect(el.exists()).toBe(true);
			expect(el.text()).toContain('5');
			expect(el.text()).toContain('шт');
		});

		it('отображает максимальную массу на коробку', () => {
			const wrapper = mount(ResultsDisplay, {
				props: { result: mockResult, isLoading: false },
			});

			const el = wrapper.find('[data-test="max-weight-per-box"]');
			expect(el.exists()).toBe(true);
			expect(el.text()).toContain('12.5');
			expect(el.text()).toContain('кг');
		});
	});
});
