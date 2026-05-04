<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

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

const rootElement = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const selectedOption = computed(() =>
	props.options.find((option) => option.value === props.modelValue),
);

const buttonText = computed(() => {
	if (selectedOption.value) {
		return selectedOption.value.label;
	}

	return props.placeholder ?? 'Выберите значение';
});

function toggleDropdown(): void {
	isOpen.value = !isOpen.value;

	if (isOpen.value) {
		document.addEventListener('click', onDocumentClick);
	}
}

function closeDropdown(): void {
	isOpen.value = false;
	document.removeEventListener('click', onDocumentClick);
}

function selectOption(value: string): void {
	emit('update:model-value', value);
	closeDropdown();
}

function onDocumentClick(event: MouseEvent): void {
	const target = event.target as Node | null;

	if (!target || !rootElement.value) {
		return;
	}

	if (!rootElement.value.contains(target)) {
		closeDropdown();
	}
}

function onKeydown(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		closeDropdown();
	}
}

onBeforeUnmount(() => {
	document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
	<div ref="rootElement" class="base-dropdown" @keydown="onKeydown">
		<label
			v-if="props.label"
			:for="props.id"
			:id="props.id ? `${props.id}-label` : undefined"
			class="base-dropdown__label"
			data-test="dropdown-label"
		>
			{{ props.label }}
		</label>

		<div class="base-dropdown__control">
			<button
				:id="props.id"
				class="base-dropdown__button"
				:class="{
					'base-dropdown__button--error': props.error,
					'base-dropdown__button--placeholder': !selectedOption,
				}"
				type="button"
				data-test="dropdown-select"
				:aria-expanded="isOpen"
				aria-haspopup="listbox"
				:aria-labelledby="
					props.id && props.label ? `${props.id}-label ${props.id}` : undefined
				"
				@click.stop="toggleDropdown"
			>
				<span class="base-dropdown__button-text">
					{{ buttonText }}
				</span>

				<svg
					class="base-dropdown__chevron"
					:class="{ 'base-dropdown__chevron--open': isOpen }"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>

			<ul v-if="isOpen" class="base-dropdown__menu" role="listbox" data-test="dropdown-menu">
				<li
					v-for="option in props.options"
					:key="option.value"
					class="base-dropdown__option"
					:class="{
						'base-dropdown__option--selected': option.value === props.modelValue,
					}"
					role="option"
					:aria-selected="option.value === props.modelValue"
					data-test="dropdown-option"
					@click="selectOption(option.value)"
				>
					<span>{{ option.label }}</span>

					<svg
						v-if="option.value === props.modelValue"
						class="base-dropdown__check"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				</li>
			</ul>
		</div>

		<span v-if="props.error" class="base-dropdown__error" data-test="dropdown-error">
			{{ props.error }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.base-dropdown {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: $spacing-xs;

	&__label {
		@include font-size('sm');

		color: $color-text;
		font-weight: $font-weight-medium;
	}

	&__control {
		position: relative;
	}

	&__button {
		@include font-size('md');
		@include transition(border-color, box-shadow, background-color);

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: $spacing-sm;
		width: 100%;
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

		&:hover {
			border-color: $color-border-focus;
		}

		&--error {
			border-color: $color-border-error;

			&:focus {
				@include focus-ring($color-border-error);

				border-color: $color-border-error;
			}
		}

		&--placeholder {
			color: $color-text-secondary;
		}
	}

	&__button-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__chevron {
		flex-shrink: 0;
		color: $color-text-secondary;
		transition: transform 0.2s ease;

		&--open {
			transform: rotate(180deg);
		}
	}

	&__menu {
		position: absolute;
		z-index: 20;
		top: calc(100% + 6px);
		left: 0;
		right: 0;
		max-height: 220px;
		margin: 0;
		padding: 6px;
		border: $border-width solid $color-border;
		border-radius: $border-radius-md;
		background-color: #ffffff;
		box-shadow: 0 12px 30px rgb(15 23 42 / 12%);
		list-style: none;
		overflow-y: auto;
	}

	&__option {
		@include font-size('md');
		@include transition(background-color, color);

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: $spacing-sm;
		padding: 10px 12px;
		border-radius: calc($border-radius-md - 2px);
		color: $color-text;
		cursor: pointer;

		&:hover {
			background-color: rgba($color-primary, 0.08);
		}

		&--selected {
			background-color: rgba($color-primary, 0.12);
			color: $color-primary;
			font-weight: $font-weight-medium;
		}
	}

	&__check {
		flex-shrink: 0;
	}

	&__error {
		@include font-size('xs');

		color: $color-error;
	}
}
</style>
