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
			<h1 class="app__title">Stacking Boxes</h1>
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
	max-width: 600px;
	margin: 0 auto;
	padding: $spacing-md;

	&__header {
		padding: $spacing-lg 0;
		text-align: center;
	}

	&__title {
		@include font-size('xl');

		font-weight: $font-weight-bold;
		color: $color-text;
	}

	&__content {
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
}
</style>
