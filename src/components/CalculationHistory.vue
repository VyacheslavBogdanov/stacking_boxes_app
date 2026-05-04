<script setup lang="ts">
import type { CalculationHistoryItem } from '@/types';

defineProps<{
	items: readonly CalculationHistoryItem[];
	selectedItem: CalculationHistoryItem | null;
}>();

const emit = defineEmits<{
	select: [id: string];
	clear: [];
}>();

function formatDateTime(value: string): string {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(value));
}
</script>

<template>
	<aside class="calculation-history">
		<header class="calculation-history__header">
			<h2 class="calculation-history__title">История</h2>

			<button
				v-if="items.length"
				class="calculation-history__clear"
				type="button"
				@click="emit('clear')"
			>
				Очистить
			</button>
		</header>

		<p v-if="!items.length" class="calculation-history__empty">История расчётов пока пуста</p>

		<ul v-else class="calculation-history__list">
			<li v-for="item in items" :key="item.id" class="calculation-history__item">
				<button
					class="calculation-history__button"
					:class="{
						'calculation-history__button--active': selectedItem?.id === item.id,
					}"
					type="button"
					@click="emit('select', item.id)"
				>
					<span class="calculation-history__date">
						{{ formatDateTime(item.createdAt) }}
					</span>

					<span class="calculation-history__grade">
						{{ item.gradeName }}
					</span>

					<span class="calculation-history__params">
						{{ item.params.length }}×{{ item.params.width }}×{{ item.params.height }} мм
						· {{ item.params.grossWeight }} кг
					</span>

					<span class="calculation-history__result">
						{{ item.result.rowCount }} шт. · {{ item.result.maxStackHeight }} мм
					</span>
				</button>
			</li>
		</ul>

		<section
			v-if="selectedItem"
			class="calculation-history__details"
			data-test="history-details"
		>
			<h3 class="calculation-history__details-title">Детали расчёта</h3>

			<dl class="calculation-history__details-list">
				<div>
					<dt>Дата</dt>
					<dd>{{ formatDateTime(selectedItem.createdAt) }}</dd>
				</div>

				<div>
					<dt>Марка</dt>
					<dd>{{ selectedItem.gradeName }}</dd>
				</div>

				<div>
					<dt>Длина</dt>
					<dd>{{ selectedItem.params.length }} мм</dd>
				</div>

				<div>
					<dt>Ширина</dt>
					<dd>{{ selectedItem.params.width }} мм</dd>
				</div>

				<div>
					<dt>Высота</dt>
					<dd>{{ selectedItem.params.height }} мм</dd>
				</div>

				<div>
					<dt>Масса брутто</dt>
					<dd>{{ selectedItem.params.grossWeight }} кг</dd>
				</div>

				<div>
					<dt>Макс. высота</dt>
					<dd>{{ selectedItem.result.maxStackHeight }} мм</dd>
				</div>

				<div>
					<dt>Кол-во рядов</dt>
					<dd>{{ selectedItem.result.rowCount }} шт</dd>
				</div>

				<div>
					<dt>Макс. масса</dt>
					<dd>{{ selectedItem.result.maxWeightPerBox }} кг</dd>
				</div>
			</dl>
		</section>
	</aside>
</template>

<style scoped lang="scss">
.calculation-history {
	width: 280px;
	padding: 16px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 12px 30px rgb(15 23 42 / 8%);

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 16px;
	}

	&__title {
		margin: 0;
		font-size: 18px;
		font-weight: 700;
		color: #1f2937;
	}

	&__clear {
		border: none;
		background: transparent;
		color: #6b7280;
		font-size: 13px;
		cursor: pointer;

		&:hover {
			color: #111827;
		}
	}

	&__empty {
		margin: 0;
		color: #6b7280;
		font-size: 14px;
	}

	&__list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 430px;
		margin: 0;
		padding: 0 4px 0 0;
		list-style: none;
		overflow-y: auto;
	}

	&__item {
		flex-shrink: 0;
	}

	&__button {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		gap: 4px;
		padding: 12px;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		background: #f9fafb;
		text-align: left;
		cursor: pointer;

		&:hover,
		&--active {
			border-color: #2563eb;
			background: #eff6ff;
		}
	}

	&__date {
		color: #6b7280;
		font-size: 12px;
	}

	&__grade {
		color: #111827;
		font-size: 15px;
		font-weight: 700;
	}

	&__params,
	&__result {
		color: #374151;
		font-size: 13px;
	}

	&__details {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #e5e7eb;
	}

	&__details-title {
		margin: 0 0 12px;
		color: #1f2937;
		font-size: 15px;
		font-weight: 700;
	}

	&__details-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;

		div {
			display: flex;
			justify-content: space-between;
			gap: 12px;
		}

		dt {
			color: #6b7280;
			font-size: 13px;
		}

		dd {
			margin: 0;
			color: #111827;
			font-size: 13px;
			font-weight: 600;
			text-align: right;
		}
	}
}

@media (max-width: 900px) {
	.calculation-history {
		width: 100%;
	}
}
</style>
