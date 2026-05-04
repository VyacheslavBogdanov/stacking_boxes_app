import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import AdminLogin from './AdminLogin.vue';

const loginMock = vi.fn();

vi.mock('@/composables/useAdmin', () => ({
	useAdmin: () => ({
		login: loginMock,
		loginError: ref(null),
		isLoading: ref(false),
	}),
}));

describe('AdminLogin', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('отображает форму входа администратора', () => {
		const wrapper = mount(AdminLogin);

		expect(wrapper.text()).toContain('Вход администратора');
		expect(wrapper.text()).toContain('Логин');
		expect(wrapper.text()).toContain('Пароль');
		expect(wrapper.text()).toContain('Войти');
	});

	it('вызывает login с введёнными данными', async () => {
		const wrapper = mount(AdminLogin);

		const inputs = wrapper.findAll('[data-test="input-field"]');

		await inputs[0].setValue('admin');
		await inputs[1].setValue('admin');

		await wrapper.find('form').trigger('submit.prevent');

		expect(loginMock).toHaveBeenCalledWith({
			username: 'admin',
			password: 'admin',
		});
	});

	it('переключает видимость пароля', async () => {
		const wrapper = mount(AdminLogin);
		const passwordInput = () => wrapper.findAll('[data-test="input-field"]')[1];

		expect(passwordInput().attributes('type')).toBe('password');

		await wrapper.find('[data-test="password-toggle"]').trigger('click');

		expect(passwordInput().attributes('type')).toBe('text');

		await wrapper.find('[data-test="password-toggle"]').trigger('click');

		expect(passwordInput().attributes('type')).toBe('password');
	});
});
