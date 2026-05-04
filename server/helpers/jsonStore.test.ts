// @vitest-environment node

import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readJsonFile, writeJsonFile } from './jsonStore';

interface TestData {
	id: string;
	name: string;
}

describe('jsonStore', () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(path.join(os.tmpdir(), 'json-store-'));
	});

	afterEach(async () => {
		await rm(tempDir, {
			recursive: true,
			force: true,
		});
	});

	it('записывает и читает JSON-файл', async () => {
		const filePath = path.join(tempDir, 'data.json');

		const data: TestData[] = [
			{
				id: '1',
				name: 'Т23',
			},
		];

		await writeJsonFile(filePath, data);

		const result = await readJsonFile<TestData[]>(filePath);

		expect(result).toEqual(data);
	});

	it('создаёт вложенные папки при записи', async () => {
		const filePath = path.join(tempDir, 'nested', 'data.json');

		const data: TestData = {
			id: '2',
			name: 'Т24',
		};

		await writeJsonFile(filePath, data);

		const result = await readJsonFile<TestData>(filePath);

		expect(result).toEqual(data);
	});
});
