import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CalculationHistory from './CalculationHistory.vue';
import type { CalculationHistoryItem } from '@/types';

const items: CalculationHistoryItem[] = [
	{
		id: '1',
		createdAt: '2026-05-04T12:00:00.000Z',
		gradeName: 'Т23',
		params: {
			length: 447,
			width: 305,
			height: 110,
			grossWeight: 2,
			gradeId: '2',
		},
		result: {
			maxStackHeight: 2016,
			rowCount: 18,
			maxWeightPerBox: 34,
		},
	},
	{
		id: '2',
		createdAt: '2026-05-04T13:00:00.000Z',
		gradeName: 'Т24',
		params: {
			length: 500,
			width: 300,
			height: 150,
			grossWeight: 3,
			gradeId: '3',
		},
		result: {
			maxStackHeight: 1800,
			rowCount: 12,
			maxWeightPerBox: 33,
		},
	},
];

describe('CalculationHistory', () => {
	it('показывает пустое состояние', () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items: [],
				selectedItem: null,
			},
		});

		expect(wrapper.text()).toContain('История расчётов пока пуста');
	});

	it('отображает список расчётов', () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items,
				selectedItem: null,
			},
		});

		expect(wrapper.text()).toContain('История');
		expect(wrapper.text()).toContain('Т23');
		expect(wrapper.text()).toContain('447×305×110');
		expect(wrapper.text()).toContain('18 шт.');
		expect(wrapper.text()).toContain('Т24');
	});

	it('эмитит select при клике по записи', async () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items,
				selectedItem: null,
			},
		});

		await wrapper.findAll('button')[1].trigger('click');

		expect(wrapper.emitted('select')).toEqual([['1']]);
	});

	it('эмитит clear при клике Очистить', async () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items,
				selectedItem: null,
			},
		});

		await wrapper.find('button.calculation-history__clear').trigger('click');

		expect(wrapper.emitted('clear')).toEqual([[]]);
	});

	it('подсвечивает выбранную запись', () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items,
				selectedItem: items[0],
			},
		});

		expect(
			wrapper.findAll('.calculation-history__button')[0].classes(),
		).toContain('calculation-history__button--active');
	});

	it('показывает детали выбранного расчёта', () => {
		const wrapper = mount(CalculationHistory, {
			props: {
				items,
				selectedItem: items[0],
			},
		});

		const details = wrapper.find('[data-test="history-details"]');

		expect(details.exists()).toBe(true);
		expect(details.text()).toContain('Детали расчёта');
		expect(details.text()).toContain('Т23');
		expect(details.text()).toContain('447 мм');
		expect(details.text()).toContain('305 мм');
		expect(details.text()).toContain('110 мм');
		expect(details.text()).toContain('2 кг');
		expect(details.text()).toContain('2016 мм');
		expect(details.text()).toContain('18 шт');
		expect(details.text()).toContain('34 кг');
	});
});
