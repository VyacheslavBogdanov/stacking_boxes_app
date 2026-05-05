<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useAdmin } from '@/composables/useAdmin';
import { useCardboardGrades } from '@/composables/useCardboardGrades';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import type { CardboardGradePayload, CardboardGradeWithProperties } from '@/types';

const { logout, clearAuth } = useAdmin();

const { adminGrades, isLoading, error, fetchAdminGrades, addGrade, updateGrade, removeGrade } =
	useCardboardGrades();

const editingGradeId = ref<string | null>(null);
const formError = ref<string | null>(null);
const actionMessage = ref<string | null>(null);
const actionError = ref<string | null>(null);
const isSaving = ref(false);
const deletingGradeId = ref<string | null>(null);

const form = reactive({
	name: '',
	thickness: '',
	crushResistance: '',
});

const isEditing = computed(() => editingGradeId.value !== null);

onMounted(async () => {
	try {
		await fetchAdminGrades();
	} catch {
		clearAuth();
	}
});

function resetMessages(): void {
	actionMessage.value = null;
	actionError.value = null;
}

function resetForm(): void {
	editingGradeId.value = null;
	form.name = '';
	form.thickness = '';
	form.crushResistance = '';
	formError.value = null;
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

function toPayload(): CardboardGradePayload | null {
	const thickness = Number(form.thickness);
	const crushResistance = Number(form.crushResistance);

	if (!form.name.trim()) {
		formError.value = 'Введите название марки';
		return null;
	}

	if (!Number.isFinite(thickness) || thickness <= 0) {
		formError.value = 'Введите корректную толщину';
		return null;
	}

	if (!Number.isFinite(crushResistance) || crushResistance <= 0) {
		formError.value = 'Введите корректное сопротивление сжатию';
		return null;
	}

	formError.value = null;

	return {
		name: form.name.trim(),
		thickness,
		crushResistance,
	};
}

async function handleSubmit(): Promise<void> {
	const payload = toPayload();

	if (!payload) {
		return;
	}

	resetMessages();
	isSaving.value = true;

	try {
		if (editingGradeId.value) {
			await updateGrade(editingGradeId.value, payload);
			actionMessage.value = 'Марка обновлена';
		} else {
			await addGrade(payload);
			actionMessage.value = 'Марка добавлена';
		}

		resetForm();
	} catch (error) {
		actionError.value = getErrorMessage(error);
	} finally {
		isSaving.value = false;
	}
}

function startEditing(grade: CardboardGradeWithProperties): void {
	resetMessages();

	editingGradeId.value = grade.id;
	form.name = grade.name;
	form.thickness = String(grade.thickness);
	form.crushResistance = String(grade.crushResistance);
	formError.value = null;
}

async function handleRemove(id: string): Promise<void> {
	const shouldRemove = window.confirm('Удалить марку картона?');

	if (!shouldRemove) {
		return;
	}

	resetMessages();
	deletingGradeId.value = id;

	try {
		await removeGrade(id);
		actionMessage.value = 'Марка удалена';

		if (editingGradeId.value === id) {
			resetForm();
		}
	} catch (error) {
		actionError.value = getErrorMessage(error);
	} finally {
		deletingGradeId.value = null;
	}
}
</script>

<template>
	<section class="admin-panel">
		<header class="admin-panel__header">
			<div>
				<h2 class="admin-panel__title">Админ-панель</h2>
				<p class="admin-panel__subtitle">Управление марками картона</p>
			</div>

			<BaseButton variant="secondary" @click="logout"> Выйти </BaseButton>
		</header>

		<form class="admin-panel__form" @submit.prevent="handleSubmit">
			<BaseInput
				v-model="form.name"
				id="grade-name"
				label="Марка картона"
				placeholder="Например, Т25"
			/>

			<BaseInput
				v-model="form.thickness"
				id="grade-thickness"
				label="Толщина"
				type="number"
				placeholder="Например, 5"
			/>

			<BaseInput
				v-model="form.crushResistance"
				id="grade-crush-resistance"
				label="Сопротивление сжатию"
				type="number"
				placeholder="Например, 5.2"
			/>

			<p v-if="formError" class="admin-panel__error">
				{{ formError }}
			</p>

			<p v-if="actionMessage" class="admin-panel__success" data-test="admin-success-message">
				{{ actionMessage }}
			</p>

			<p v-if="actionError" class="admin-panel__error" data-test="admin-error-message">
				{{ actionError }}
			</p>

			<div class="admin-panel__actions">
				<BaseButton type="submit" :disabled="isSaving">
					{{ isSaving ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Добавить' }}
				</BaseButton>

				<BaseButton
					v-if="isEditing"
					type="button"
					variant="secondary"
					:disabled="isSaving"
					@click="resetForm"
				>
					Отмена
				</BaseButton>
			</div>
		</form>

		<p v-if="error" class="admin-panel__error">
			{{ error }}
		</p>

		<p v-if="isLoading" class="admin-panel__status">Загрузка марок...</p>

		<div v-else class="admin-panel__table-wrapper">
			<table class="admin-panel__table">
				<thead>
					<tr>
						<th>Марка</th>
						<th>Толщина</th>
						<th>Сопротивление</th>
						<th>Действия</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="grade in adminGrades" :key="grade.id">
						<td>{{ grade.name }}</td>
						<td>{{ grade.thickness }}</td>
						<td>{{ grade.crushResistance }}</td>
						<td>
							<div class="admin-panel__item-actions">
								<BaseButton
									type="button"
									variant="secondary"
									:disabled="isSaving || deletingGradeId === grade.id"
									@click="startEditing(grade)"
								>
									Редактировать
								</BaseButton>

								<BaseButton
									type="button"
									variant="secondary"
									:disabled="isSaving || deletingGradeId === grade.id"
									@click="handleRemove(grade.id)"
								>
									{{ deletingGradeId === grade.id ? 'Удаление...' : 'Удалить' }}
								</BaseButton>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<style scoped lang="scss">
.admin-panel {
	width: 100%;
	max-width: 820px;
	margin: 0 auto;
	padding: 24px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 12px 30px rgb(15 23 42 / 8%);

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}

	&__title {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		color: #1f2937;
	}

	&__subtitle {
		margin: 4px 0 0;
		color: #6b7280;
	}

	&__form {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-bottom: 24px;
	}

	&__actions {
		display: flex;
		gap: 12px;
		grid-column: 1 / -1;
	}

	&__error,
	&__success {
		grid-column: 1 / -1;
		margin: 0;
		font-size: 14px;
	}

	&__error {
		color: #dc2626;
	}

	&__success {
		color: #15803d;
	}

	&__status {
		margin: 0;
		color: #6b7280;
	}

	&__table-wrapper {
		overflow-x: auto;
	}

	&__table {
		width: 100%;
		border-collapse: collapse;

		th,
		td {
			padding: 12px;
			border-bottom: 1px solid #e5e7eb;
			text-align: left;
		}

		th {
			color: #6b7280;
			font-size: 13px;
			font-weight: 700;
		}

		td {
			color: #111827;
			font-size: 14px;
		}
	}

	&__item-actions {
		display: flex;
		gap: 8px;
	}
}

@media (max-width: 700px) {
	.admin-panel {
		&__header {
			align-items: stretch;
			flex-direction: column;
		}

		&__form {
			grid-template-columns: 1fr;
		}

		&__item-actions {
			flex-direction: column;
		}
	}
}
</style>
