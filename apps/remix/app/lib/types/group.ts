export type PartialGroup = {
	id: number;
	name: string;
};

export type GroupDetail = {
	id: number;
	name: string;
	memberPermissions: {
		member: {
			id: string;
			username: string;
			userId: string;
			user: {
				email: string;
			};
		};
		permission: number;
	}[];
	isSuper: boolean;
};
