<script setup lang="ts">
import type { CalculationResult } from '@/types';

interface Props {
	result: CalculationResult | null;
	isLoading: boolean;
}

const props = defineProps<Props>();

interface ResultItem {
	key: keyof CalculationResult;
	label: string;
	unit: string;
	testId: string;
}

const RESULT_ITEMS: ResultItem[] = [
	{
		key: 'maxStackHeight',
		label: 'Макс. высота штабеля',
		unit: 'мм',
		testId: 'max-stack-height',
	},
	{ key: 'rowCount', label: 'Количество рядов', unit: 'шт', testId: 'row-count' },
	{
		key: 'maxWeightPerBox',
		label: 'Макс. масса на коробку',
		unit: 'кг',
		testId: 'max-weight-per-box',
	},
];
</script>

<template>
	<div class="results-display">
		<div v-if="props.isLoading" class="results-display__loading" data-test="results-loading">
			Загрузка...
		</div>
		<div v-else-if="!props.result" class="results-display__empty" data-test="results-empty">
			Введите параметры коробки и нажмите «Рассчитать»
		</div>
		<div v-else class="results-display__content" data-test="results-content">
			<div
				v-for="item in RESULT_ITEMS"
				:key="item.key"
				class="results-display__item"
				:data-test="item.testId"
			>
				<span class="results-display__item-label">{{ item.label }}</span>
				<span class="results-display__item-value">{{ props.result[item.key] }}</span>
				<span class="results-display__item-unit">{{ item.unit }}</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.results-display {
	&__loading {
		@include font-size('md');

		padding: $spacing-lg;
		text-align: center;
		color: $color-text-secondary;
	}

	&__empty {
		@include font-size('md');

		padding: $spacing-lg;
		text-align: center;
		color: $color-text-secondary;
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
	}

	&__item {
		display: flex;
		align-items: baseline;
		gap: $spacing-sm;
		padding: $spacing-md;
		border: $border-width solid $color-border;
		border-radius: $border-radius-md;
		background-color: $color-bg-input;
	}

	&__item-label {
		@include font-size('sm');

		color: $color-text-secondary;
		flex: 1;
	}

	&__item-value {
		@include font-size('lg');

		font-weight: $font-weight-bold;
		color: $color-text;
	}

	&__item-unit {
		@include font-size('sm');

		color: $color-text-secondary;
	}
}
</style>
