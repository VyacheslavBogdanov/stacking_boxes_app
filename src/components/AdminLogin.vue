<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useAdmin } from '@/composables/useAdmin';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const { login, loginError, isLoading } = useAdmin();

const credentials = reactive({
	username: '',
	password: '',
});

const isPasswordVisible = ref(false);

const passwordInputType = computed(() => (isPasswordVisible.value ? 'text' : 'password'));

const passwordToggleLabel = computed(() =>
	isPasswordVisible.value ? 'Скрыть пароль' : 'Показать пароль',
);

function togglePasswordVisibility(): void {
	isPasswordVisible.value = !isPasswordVisible.value;
}

async function handleSubmit(): Promise<void> {
	await login({
		username: credentials.username,
		password: credentials.password,
	});
}
</script>

<template>
	<section class="admin-login">
		<h2 class="admin-login__title">Вход администратора</h2>

		<form class="admin-login__form" @submit.prevent="handleSubmit">
			<BaseInput
				v-model="credentials.username"
				id="username"
				label="Логин"
				placeholder="Введите логин"
			/>

			<div class="admin-login__password">
				<label class="admin-login__password-label" for="password"> Пароль </label>

				<div class="admin-login__password-field">
					<input
						v-model="credentials.password"
						id="password"
						class="admin-login__password-input"
						data-test="input-field"
						:type="passwordInputType"
						placeholder="Введите пароль"
					/>

					<button
						class="admin-login__password-toggle"
						type="button"
						:aria-label="passwordToggleLabel"
						data-test="password-toggle"
						@click="togglePasswordVisibility"
					>
						<svg
							v-if="!isPasswordVisible"
							class="admin-login__password-icon"
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
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>

						<svg
							v-else
							class="admin-login__password-icon"
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
							<path
								d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a20.29 20.29 0 0 1 5.06-5.94"
							/>
							<path
								d="M9.9 4.24A10.45 10.45 0 0 1 12 4c7 0 11 8 11 8a20.79 20.79 0 0 1-2.22 3.31"
							/>
							<path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
							<path d="M1 1l22 22" />
						</svg>
					</button>
				</div>
			</div>

			<p v-if="loginError" class="admin-login__error">
				{{ loginError }}
			</p>

			<BaseButton type="submit" :disabled="isLoading">
				{{ isLoading ? 'Вход...' : 'Войти' }}
			</BaseButton>
		</form>
	</section>
</template>

<style scoped lang="scss">
.admin-login {
	width: 100%;
	max-width: 420px;
	margin: 0 auto;
	padding: 24px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 12px 30px rgb(15 23 42 / 8%);

	&__title {
		margin: 0 0 24px;
		font-size: 24px;
		font-weight: 700;
		color: #1f2937;
		text-align: center;
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__password {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__password-label {
		color: #374151;
		font-size: 14px;
		font-weight: 500;
	}

	&__password-field {
		position: relative;
	}

	&__password-input {
		width: 100%;
		height: 42px;
		padding: 10px 46px 10px 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background: #ffffff;
		color: #111827;
		font-size: 16px;
		line-height: 20px;
		outline: none;

		&:focus {
			border-color: #2563eb;
			box-shadow: 0 0 0 3px rgb(37 99 235 / 12%);
		}

		&::placeholder {
			color: #9ca3af;
		}
	}

	&__password-toggle {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: #6b7280;
		cursor: pointer;

		&:hover {
			background: #f3f4f6;
			color: #111827;
		}
	}

	&__password-icon {
		display: block;
		flex-shrink: 0;
	}

	&__error {
		margin: 0;
		color: #dc2626;
		font-size: 14px;
	}
}
</style>
