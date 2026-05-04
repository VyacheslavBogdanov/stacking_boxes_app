import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import AdminPanel from './AdminPanel.vue';

const logoutMock = vi.fn();
const fetchAdminGradesMock = vi.fn();
const addGradeMock = vi.fn();
const updateGradeMock = vi.fn();
const removeGradeMock = vi.fn();

const adminGrades = ref([
	{
		id: '1',
		name: 'Т11',
		thickness: 1.6,
		crushResistance: 3,
	},
	{
		id: '2',
		name: 'Т23',
		thickness: 3.5,
		crushResistance: 3.8,
	},
]);

vi.mock('@/composables/useAdmin', () => ({
	useAdmin: () => ({
		logout: logoutMock,
	}),
}));

vi.mock('@/composables/useCardboardGrades', () => ({
	useCardboardGrades: () => ({
		adminGrades,
		isLoading: ref(false),
		error: ref(null),
		fetchAdminGrades: fetchAdminGradesMock,
		addGrade: addGradeMock,
		updateGrade: updateGradeMock,
		removeGrade: removeGradeMock,
	}),
}));

describe('AdminPanel', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		Object.defineProperty(window, 'confirm', {
			value: vi.fn(() => true),
			writable: true,
			configurable: true,
		});

		addGradeMock.mockResolvedValue(undefined);
		updateGradeMock.mockResolvedValue(undefined);
		removeGradeMock.mockResolvedValue(undefined);

		adminGrades.value = [
			{
				id: '1',
				name: 'Т11',
				thickness: 1.6,
				crushResistance: 3,
			},
			{
				id: '2',
				name: 'Т23',
				thickness: 3.5,
				crushResistance: 3.8,
			},
		];
	});

	it('загружает и отображает полные данные марок картона', () => {
		const wrapper = mount(AdminPanel);

		expect(fetchAdminGradesMock).toHaveBeenCalledOnce();
		expect(wrapper.text()).toContain('Админ-панель');
		expect(wrapper.text()).toContain('Т11');
		expect(wrapper.text()).toContain('1.6');
		expect(wrapper.text()).toContain('3');
		expect(wrapper.text()).toContain('Т23');
		expect(wrapper.text()).toContain('3.5');
		expect(wrapper.text()).toContain('3.8');
	});

	it('добавляет новую марку картона и показывает success-сообщение', async () => {
		const wrapper = mount(AdminPanel);
		const inputs = wrapper.findAll('[data-test="input-field"]');

		await inputs[0].setValue('Т25');
		await inputs[1].setValue('5');
		await inputs[2].setValue('5.2');

		await wrapper.find('form').trigger('submit.prevent');

		expect(addGradeMock).toHaveBeenCalledWith({
			name: 'Т25',
			thickness: 5,
			crushResistance: 5.2,
		});
		expect(wrapper.text()).toContain('Марка добавлена');
	});

	it('показывает ошибку если название пустое', async () => {
		const wrapper = mount(AdminPanel);
		const inputs = wrapper.findAll('[data-test="input-field"]');

		await inputs[1].setValue('5');
		await inputs[2].setValue('5.2');

		await wrapper.find('form').trigger('submit.prevent');

		expect(addGradeMock).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain('Введите название марки');
	});

	it('при редактировании подставляет name, thickness и crushResistance', async () => {
		const wrapper = mount(AdminPanel);

		await wrapper
			.findAll('button')
			.find((button) => button.text().includes('Редактировать'))
			?.trigger('click');

		const inputs = wrapper.findAll('[data-test="input-field"]');

		expect((inputs[0].element as HTMLInputElement).value).toBe('Т11');
		expect((inputs[1].element as HTMLInputElement).value).toBe('1.6');
		expect((inputs[2].element as HTMLInputElement).value).toBe('3');
	});

	it('редактирует марку картона и показывает success-сообщение', async () => {
		const wrapper = mount(AdminPanel);

		await wrapper
			.findAll('button')
			.find((button) => button.text().includes('Редактировать'))
			?.trigger('click');

		const inputs = wrapper.findAll('[data-test="input-field"]');

		await inputs[0].setValue('Т11 updated');
		await inputs[1].setValue('1.7');
		await inputs[2].setValue('3.1');

		await wrapper.find('form').trigger('submit.prevent');

		expect(updateGradeMock).toHaveBeenCalledWith('1', {
			name: 'Т11 updated',
			thickness: 1.7,
			crushResistance: 3.1,
		});
		expect(wrapper.text()).toContain('Марка обновлена');
	});

	it('подтверждает удаление марки картона', async () => {
		const wrapper = mount(AdminPanel);

		await wrapper
			.findAll('button')
			.find((button) => button.text().includes('Удалить'))
			?.trigger('click');

		expect(window.confirm).toHaveBeenCalledWith('Удалить марку картона?');
		expect(removeGradeMock).toHaveBeenCalledWith('1');
		expect(wrapper.text()).toContain('Марка удалена');
	});

	it('не удаляет марку если пользователь отменил подтверждение', async () => {
		vi.mocked(window.confirm).mockReturnValueOnce(false);

		const wrapper = mount(AdminPanel);

		await wrapper
			.findAll('button')
			.find((button) => button.text().includes('Удалить'))
			?.trigger('click');

		expect(removeGradeMock).not.toHaveBeenCalled();
	});

	it('показывает ошибку при неудачном добавлении', async () => {
		addGradeMock.mockRejectedValueOnce(new Error('Ошибка добавления'));

		const wrapper = mount(AdminPanel);
		const inputs = wrapper.findAll('[data-test="input-field"]');

		await inputs[0].setValue('Т25');
		await inputs[1].setValue('5');
		await inputs[2].setValue('5.2');

		await wrapper.find('form').trigger('submit.prevent');

		expect(wrapper.text()).toContain('Ошибка добавления');
	});

	it('вызывает logout при нажатии Выйти', async () => {
		const wrapper = mount(AdminPanel);

		await wrapper
			.findAll('button')
			.find((button) => button.text().includes('Выйти'))
			?.trigger('click');

		expect(logoutMock).toHaveBeenCalledOnce();
	});
});
