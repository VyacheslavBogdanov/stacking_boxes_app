import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function readJsonFile<T>(filePath: string): Promise<T> {
	const content = await readFile(filePath, 'utf-8');

	return JSON.parse(content) as T;
}

export async function writeJsonFile<T>(
	filePath: string,
	data: T,
): Promise<void> {
	await mkdir(path.dirname(filePath), {
		recursive: true,
	});

	await writeFile(filePath, `${JSON.stringify(data, null, '\t')}\n`, 'utf-8');
}
