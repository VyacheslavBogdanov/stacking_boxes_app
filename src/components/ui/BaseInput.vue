<script setup lang="ts">
interface Props {
	modelValue: string | number;
	label?: string;
	placeholder?: string;
	error?: string;
	type?: string;
	id?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
});

const emit = defineEmits<{
	'update:model-value': [value: string];
}>();

function onInput(event: Event) {
	const target = event.target as HTMLInputElement;
	emit('update:model-value', target.value);
}
</script>

<template>
	<div class="base-input">
		<label v-if="props.label" :for="props.id" class="base-input__label" data-test="input-label">
			{{ props.label }}
		</label>
		<input
			:id="props.id"
			:type="props.type"
			:value="props.modelValue"
			:placeholder="props.placeholder"
			class="base-input__field"
			:class="{ 'base-input__field--error': props.error }"
			data-test="input-field"
			@input="onInput"
		/>
		<span v-if="props.error" class="base-input__error" data-test="input-error">
			{{ props.error }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.base-input {
	display: flex;
	flex-direction: column;
	gap: $spacing-xs;

	&__label {
		@include font-size('sm');

		color: $color-text;
		font-weight: $font-weight-medium;
	}

	&__field {
		@include font-size('md');
		@include transition(border-color, box-shadow);

		height: $input-height;
		padding: $spacing-sm $spacing-md;
		border: $border-width solid $color-border;
		border-radius: $border-radius-md;
		background-color: $color-bg-input;
		color: $color-text;

		&::placeholder {
			color: $color-text-placeholder;
		}

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
