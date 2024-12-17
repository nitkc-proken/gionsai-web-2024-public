export type Notification = {
	id: number;
	projectId: number;
	project: NotificationProject;
	title: string;
	content: string;
	visible: boolean;
	createdAt: string;
	updatedAt: string;
};

type NotificationProject = {
	id: number;
	name: string;
	alias: string;
	location: string;
};
