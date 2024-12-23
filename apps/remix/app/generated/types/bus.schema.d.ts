/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * east : 東口 west : 西口
 */
export type NoName = "east" | "west";
/**
 * front : 高専前 back : 高専裏
 */
export type NoName1 = "front" | "back";
/**
 * front : 高専前 back : 高専裏
 */
export type NoName2 = "front" | "back";
/**
 * east : 東口 west : 西口
 */
export type NoName3 = "east" | "west";

/**
 * バスの時刻表
 */
export interface BusTimetable {
	/**
	 * 駅から高専に行くバス
	 */
	toKosen: {
		from: NoName;
		to: NoName1;
		time: string[];
		additionalProperties?: never;
		[k: string]: unknown;
	}[];
	/**
	 * 高専から駅に行くバス
	 */
	fromKosen: {
		from: NoName2;
		to: NoName3;
		time: string[];
		additionalProperties?: never;
		[k: string]: unknown;
	}[];
}
