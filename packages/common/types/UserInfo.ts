export type UserInfo = {
	userId: string;
	memberId: string;
	username: string;
	email: string;
	memberPermissions: MemberPermission[];
};

export type MemberPermission = {
	groupId: number;
	permission: number;
	group: {
		id: number;
		name: string;
		isSuper: boolean;
	};
};
