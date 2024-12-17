export const Permissions = {
	SUPER_ADMIN: 1 << 9,
	SUPER_READ_AUDIT: 1 << 8,
	SUPER_APPROVER: 1 << 7,
	SUPER_READ_MEMBER: 1 << 6,
	SUPER_DELETE_PROJECT: 1 << 5,
	SUPER_DELETE_NOTIFICATION: 1 << 4,
	PROJECT_ADMIN: 1 << 3,
	WRITE_PROJECT_INFO: 1 << 2,
	DELETE_NOTIFICATION: 1 << 1,
	CREATE_NOTIFICATION: 1 << 0,
} as const;

export type Permission = keyof typeof Permissions;

export type PermissionObject = {
	[K in Permission]: boolean;
};

// 名前で指定された Permission を持っているかどうか
export function hasPermissionByName(
	permission: number,
	...permissionType: Permission[]
): boolean {
	const permissionBits = permissionType.reduce<number>(
		(acc, type) => acc | Permissions[type],
		0,
	);
	return hasPermission(permission, permissionBits);
}

// ビットで指定された Permission を持っているかどうか
export function hasPermission(
	permission: number,
	permissionBits: number,
): boolean {
	return (permission & permissionBits) === permissionBits;
}

export function permissionObject(permission: number): PermissionObject {
	return Object.fromEntries(
		Object.entries(Permissions).map(([key, value]) => [
			key,
			hasPermission(permission, value),
		]),
	) as PermissionObject;
}

export function permissionList(permission: number): Permission[] {
	return Object.entries(Permissions)
		.filter(([key, value]) => hasPermission(permission, value))
		.map(([key]) => key as Permission);
}
