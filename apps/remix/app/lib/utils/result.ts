type Success<T> = {
	success: true;
	data: T;
};
type Error<T> = {
	success: false;
	error: T;
};
export type Result<S = undefined, E = string> = Success<S> | Error<E>;

function success(): Success<undefined>;
function success<const S>(data: S): Success<S>;

function success<const S>(data?: S): Success<S | undefined> {
	return { success: true, data };
}

function error<const E>(error: E): Error<E> {
	return { success: false, error };
}

export const r = { success, error };
