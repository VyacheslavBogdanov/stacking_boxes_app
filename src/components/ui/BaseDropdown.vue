<script setup lang="ts">
interface DropdownOption {
	value: string;
	label: string;
}

interface Props {
	modelValue: string;
	options: DropdownOption[];
	placeholder?: string;
	label?: string;
	error?: string;
	id?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:model-value': [value: string];
}>();

function onChange(event: Event) {
	const target = event.target as HTMLSelectElement;
	emit('update:model-value', target.value);
}
</script>

<template>
	<div class="base-dropdown">
		<label
			v-if="props.label"
			:for="props.id"
			class="base-dropdown__label"
			data-test="dropdown-label"
		>
			{{ props.label }}
		</label>
		<select
			:id="props.id"
			:value="props.modelValue"
			class="base-dropdown__select"
			:class="{ 'base-dropdown__select--error': props.error }"
			data-test="dropdown-select"
			@change="onChange"
		>
			<option v-if="props.placeholder" value="" disabled>
				{{ props.placeholder }}
			</option>
			<option v-for="option in props.options" :key="option.value" :value="option.value">
				{{ option.label }}
			</option>
		</select>
		<span v-if="props.error" class="base-dropdown__error" data-test="dropdown-error">
			{{ props.error }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.base-dropdown {
	display: flex;
	flex-direction: column;
	gap: $spacing-xs;

	&__label {
		@include font-size('sm');

		color: $color-text;
		font-weight: $font-weight-medium;
	}

	&__select {
		@include font-size('md');
		@include transition(border-color, box-shadow);

		height: $input-height;
		padding: $spacing-sm $spacing-md;
		border: $border-width solid $color-border;
		border-radius: $border-radius-md;
		background-color: $color-bg-input;
		color: $color-text;
		cursor: pointer;

		&:focus {
			@include focus-ring;

			border-color: $color-border-focus;
		}

		&--error {
			border-color: $color-border-error;

			&:focus {
				@include focus-ring($color-border-error);

				border-color: $color-border-error;
			}
		}
	}

	&__error {
		@include font-size('xs');

		color: $color-error;
	}
}
</style>
