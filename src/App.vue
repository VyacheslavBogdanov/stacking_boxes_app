<script setup lang="ts">
import { computed, ref } from 'vue';
import AdminLogin from '@/components/AdminLogin.vue';
import AdminPanel from '@/components/AdminPanel.vue';
import BoxInputForm from '@/components/BoxInputForm.vue';
import CalculationHistory from '@/components/CalculationHistory.vue';
import ResultsDisplay from '@/components/ResultsDisplay.vue';
import { useAdmin } from '@/composables/useAdmin';
import { useCalculationHistory } from '@/composables/useCalculationHistory';
import { useCardboardGrades } from '@/composables/useCardboardGrades';
import { useStackCalculation } from '@/composables/useStackCalculation';
import type { BoxParams } from '@/types';

const { result, isLoading, error, calculate } = useStackCalculation();
const { isAuthenticated } = useAdmin();
const { grades } = useCardboardGrades();

const {
	items: historyItems,
	selectedItem,
	addItem,
	selectItem,
	clearSelectedItem,
	clearHistory,
} = useCalculationHistory();

const isAdminMode = ref(false);
const isResultVisible = ref(true);

const contentClass = computed(() => ({
	'app__content--wide': isAdminMode.value && isAuthenticated.value,
	'app__content--with-history': !isAdminMode.value,
}));

const displayedResult = computed(() => selectedItem.value?.result ?? result.value);

function getGradeName(gradeId: string): string {
	return grades.value.find((grade) => grade.id === gradeId)?.name ?? gradeId;
}

async function onFormSubmit(params: BoxParams): Promise<void> {
	clearSelectedItem();
	isResultVisible.value = true;

	await calculate(params);

	if (error.value || !result.value) {
		return;
	}

	addItem({
		params,
		gradeName: getGradeName(params.gradeId),
		result: result.value,
	});
}

function openAdminMode(): void {
	isAdminMode.value = true;
}

function closeAdminMode(): void {
	isAdminMode.value = false;
}

function closeResult(): void {
	isResultVisible.value = false;
}

function handleSelectHistoryItem(id: string): void {
	selectItem(id);
	isResultVisible.value = true;
}

function handleClearHistory(): void {
	clearHistory();
	isResultVisible.value = Boolean(result.value);
}
</script>

<template>
	<div class="app">
		<header class="app__header">
			<div class="app__header-inner">
				<h1 class="app__title">Калькулятор штабелирования коробок</h1>

				<button
					v-if="!isAdminMode"
					class="app__admin-icon"
					type="button"
					aria-label="Вход администратора"
					@click="openAdminMode"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
						/>
					</svg>
				</button>

				<button v-else class="app__back-button" type="button" @click="closeAdminMode">
					К калькулятору
				</button>
			</div>
		</header>

		<main class="app__content" :class="contentClass">
			<template v-if="isAdminMode">
				<AdminPanel v-if="isAuthenticated" />
				<AdminLogin v-else />
			</template>

			<template v-else>
				<div class="app__workspace">
					<CalculationHistory
						class="app__history"
						:items="historyItems"
						:selected-item="selectedItem"
						@select="handleSelectHistoryItem"
						@clear="handleClearHistory"
					/>

					<section class="app__calculator">
						<BoxInputForm @submit="onFormSubmit" />

						<div v-if="error" class="app__error">
							{{ error }}
						</div>

						<ResultsDisplay
							v-if="isLoading || !displayedResult || isResultVisible"
							:result="displayedResult"
							:is-loading="isLoading"
							@close="closeResult"
						/>
					</section>
				</div>
			</template>
		</main>
	</div>
</template>

<style lang="scss" scoped>
.app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	&__header {
		background-color: $color-primary;
		padding: $spacing-md $spacing-lg;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
	}

	&__header-inner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		gap: $spacing-md;
	}

	&__title {
		@include font-size('xl');

		font-weight: $font-weight-bold;
		color: $color-text-inverse;
	}

	&__admin-icon {
		@include transition(background-color, opacity);

		position: absolute;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $spacing-sm;
		border: none;
		border-radius: $border-radius-md;
		background: none;
		color: $color-text-inverse;
		cursor: pointer;

		&:hover {
			background-color: rgba(255, 255, 255, 0.15);
		}
	}

	&__back-button {
		@include font-size('sm');
		@include transition(background-color);

		position: absolute;
		right: 0;
		padding: $spacing-sm $spacing-md;
		border: $border-width solid rgba(255, 255, 255, 0.5);
		border-radius: $border-radius-md;
		background: transparent;
		color: $color-text-inverse;
		cursor: pointer;

		&:hover {
			background-color: rgba(255, 255, 255, 0.15);
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
		max-width: 600px;
		width: 100%;
		margin: 40px auto;
		padding: $spacing-md;

		&--wide {
			max-width: 760px;
		}

		&--with-history {
			max-width: 1200px;
		}
	}

	&__workspace {
		display: grid;
		grid-template-columns: 280px minmax(0, 600px) 280px;
		align-items: start;
		justify-content: center;
		gap: $spacing-xl;
		width: 100%;
	}

	&__calculator {
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
	}

	&__error {
		@include font-size('sm');

		padding: $spacing-md;
		border-radius: $border-radius-md;
		background-color: rgba($color-danger, 0.1);
		color: $color-danger;
		text-align: center;
	}
	&__history {
		grid-column: 1;
	}

	&__calculator {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
	}
}

@media (max-width: 900px) {
	.app {
		&__header-inner {
			justify-content: space-between;
		}

		&__admin-icon,
		&__back-button {
			position: static;
		}

		&__workspace {
			grid-template-columns: 1fr;
		}

		&__history,
		&__calculator {
			grid-column: 1;
		}
	}
}
</style>
