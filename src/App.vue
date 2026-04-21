<script setup lang="ts">
import BoxInputForm from '@/components/BoxInputForm.vue';
import ResultsDisplay from '@/components/ResultsDisplay.vue';
import { useStackCalculation } from '@/composables/useStackCalculation';
import type { BoxParams } from '@/types';

const { result, isLoading, error, calculate } = useStackCalculation();

function onFormSubmit(params: BoxParams) {
	calculate(params);
}
</script>

<template>
	<div class="app">
		<header class="app__header">
			<div class="app__header-inner">
				<h1 class="app__title">Калькулятор штабелирования коробок</h1>
				<button class="app__admin-icon" disabled aria-label="Вход администратора">
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
			</div>
		</header>
		<main class="app__content">
			<BoxInputForm @submit="onFormSubmit" />
			<div v-if="error" class="app__error">{{ error }}</div>
			<ResultsDisplay :result="result" :is-loading="isLoading" />
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 600px;
		margin: 0 auto;
	}

	&__title {
		@include font-size('xl');

		font-weight: $font-weight-bold;
		color: $color-text-inverse;
	}

	&__admin-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: $spacing-sm;
		border: none;
		background: none;
		color: $color-text-inverse;
		opacity: 0.5;
		cursor: not-allowed;
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: $spacing-xl;
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		padding: $spacing-md;
	}

	&__error {
		@include font-size('sm');

		padding: $spacing-md;
		border-radius: $border-radius-md;
		background-color: rgba($color-danger, 0.1);
		color: $color-danger;
		text-align: center;
	}
}
</style>
