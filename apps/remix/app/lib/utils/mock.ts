import { PUBLIC_ENV } from "./env";

export const isUsingMock: boolean = true// for making repo public //PUBLIC_ENV.USE_MOCK === "true";

class MockDB {
	maps: Map<string, Map<unknown, unknown>> = new Map();
	arrays: Map<string, unknown[]> = new Map();
	getMap<K, V>(id: string, defaultValue?: Map<K, V>): Map<K, V> {
		if (!this.maps.has(id)) {
			this.maps.set(
				id,
				defaultValue ? new Map(Object.entries(defaultValue)) : new Map(),
			);
		}
		return this.maps.get(id) as Map<K, V>;
	}
	getArray<V>(id: string, defaultValue?: Array<V>): Array<V> {
		if (!this.arrays.has(id)) {
			this.arrays.set(id, defaultValue ? defaultValue : []);
		}
		return this.arrays.get(id) as Array<V>;
	}
}

export function mock<T>(impl: T, mock: T): T {
	return isUsingMock ? mock : impl;
}

export const _mockDB = new MockDB();

export function mockWithMap<K, V, T, M extends T = T>(
	id: string,
	mockInstance: (map: Map<K, V>) => M,
	defaultValue?: Map<K, V>,
): M {
	return mockInstance(_mockDB.getMap(id, defaultValue));
}
export function mockWithArray<V, T, M extends T = T>(
	id: string,
	mockInstance: (map: Array<V>) => M,
	defaultValue?: Array<V>,
): M {
	return mockInstance(_mockDB.getArray(id, defaultValue));
}
