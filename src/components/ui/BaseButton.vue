<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface Props {
	variant?: ButtonVariant;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'primary',
	disabled: false,
	type: 'button',
});

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

function onClick(event: MouseEvent) {
	if (!props.disabled) {
		emit('click', event);
	}
}
</script>

<template>
	<button
		:type="props.type"
		:disabled="props.disabled"
		class="base-button"
		:class="[`base-button--${props.variant}`, { 'base-button--disabled': props.disabled }]"
		@click="onClick"
	>
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.base-button {
	@include font-size('md');
	@include transition(background-color, border-color, box-shadow);

	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: $button-height;
	padding: $spacing-sm $spacing-md;
	border: $border-width solid transparent;
	border-radius: $border-radius-md;
	font-weight: $font-weight-medium;
	cursor: pointer;

	&:focus-visible {
		@include focus-ring;
	}

	&--primary {
		background-color: $color-primary;
		color: $color-text-inverse;

		&:hover {
			background-color: $color-primary-hover;
		}

		&:active {
			background-color: $color-primary-active;
		}
	}

	&--secondary {
		background-color: $color-bg;
		border-color: $color-border;
		color: $color-secondary;

		&:hover {
			background-color: $color-bg-disabled;
			color: $color-secondary-hover;
		}

		&:active {
			color: $color-secondary-active;
		}
	}

	&--danger {
		background-color: $color-danger;
		color: $color-text-inverse;

		&:hover {
			background-color: $color-danger-hover;
		}

		&:active {
			background-color: $color-danger-active;
		}
	}

	&--disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
}
</style>
