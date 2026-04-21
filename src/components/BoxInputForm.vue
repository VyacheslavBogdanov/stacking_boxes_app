<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseDropdown from '@/components/ui/BaseDropdown.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useCardboardGrades } from '@/composables/useCardboardGrades';
import type { BoxParams } from '@/types';

const ERROR_REQUIRED = 'Обязательное поле';
const ERROR_POSITIVE_NUMBER = 'Значение должно быть больше 0';
const ERROR_SELECT_GRADE = 'Выберите марку картона';

const emit = defineEmits<{
	submit: [params: BoxParams];
}>();

const { grades, fetchGrades } = useCardboardGrades();

const length = ref('');
const width = ref('');
const height = ref('');
const grossWeight = ref('');
const gradeId = ref('');
const submitted = ref(false);

const errors = reactive({
	length: '',
	width: '',
	height: '',
	grossWeight: '',
	gradeId: '',
});

const gradeOptions = computed(() => grades.value.map((g) => ({ value: g.id, label: g.name })));

function validateNumberField(value: string): string {
	if (value.trim() === '') return ERROR_REQUIRED;
	const num = Number(value);
	if (Number.isNaN(num) || num <= 0) return ERROR_POSITIVE_NUMBER;
	return '';
}

function validate(): boolean {
	errors.length = validateNumberField(length.value);
	errors.width = validateNumberField(width.value);
	errors.height = validateNumberField(height.value);
	errors.grossWeight = validateNumberField(grossWeight.value);
	errors.gradeId = gradeId.value === '' ? ERROR_SELECT_GRADE : '';

	return (
		!errors.length && !errors.width && !errors.height && !errors.grossWeight && !errors.gradeId
	);
}

function onSubmit() {
	submitted.value = true;

	if (!validate()) return;

	emit('submit', {
		length: Number(length.value),
		width: Number(width.value),
		height: Number(height.value),
		grossWeight: Number(grossWeight.value),
		gradeId: gradeId.value,
	});
}

onMounted(() => {
	fetchGrades();
});
</script>

<template>
	<form class="box-input-form" data-test="box-input-form" @submit.prevent="onSubmit">
		<div class="box-input-form__fields">
			<div class="box-input-form__field" data-test="length-input">
				<BaseInput
					v-model="length"
					label="Длина"
					id="length"
					type="number"
					placeholder="мм"
					:error="submitted ? errors.length : ''"
				/>
			</div>
			<div class="box-input-form__field" data-test="width-input">
				<BaseInput
					v-model="width"
					label="Ширина"
					id="width"
					type="number"
					placeholder="мм"
					:error="submitted ? errors.width : ''"
				/>
			</div>
			<div class="box-input-form__field" data-test="height-input">
				<BaseInput
					v-model="height"
					label="Высота"
					id="height"
					type="number"
					placeholder="мм"
					:error="submitted ? errors.height : ''"
				/>
			</div>
			<div class="box-input-form__field" data-test="gross-weight-input">
				<BaseInput
					v-model="grossWeight"
					label="Масса брутто"
					id="gross-weight"
					type="number"
					placeholder="кг"
					:error="submitted ? errors.grossWeight : ''"
				/>
			</div>
			<div class="box-input-form__field" data-test="grade-dropdown">
				<BaseDropdown
					v-model="gradeId"
					:options="gradeOptions"
					label="Марка картона"
					id="grade"
					placeholder="Выберите марку"
					:error="submitted ? errors.gradeId : ''"
				/>
			</div>
		</div>
		<div class="box-input-form__actions">
			<BaseButton type="submit" data-test="submit-button"> Рассчитать </BaseButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.box-input-form {
	display: flex;
	flex-direction: column;
	gap: $spacing-lg;

	&__fields {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
	}

	&__actions {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
