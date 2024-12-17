import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwind from "../../../tailwind.config";
import { useIsomorphicEffect } from "./hooks";

const mergedTheme = {
	...defaultTheme,
	...tailwind.theme,
};
const breakpoints = mergedTheme.screens;
const breakpointKeys = Object.keys(breakpoints) as (keyof typeof breakpoints)[];
type BreakPoints = (typeof breakpointKeys)[number];

type BreakPointValues<V> = { default: V } & Partial<Record<BreakPoints, V>>;
function getCurrentBreakPoint() {
	const width = window.innerWidth;
	let result: BreakPoints | null = null;
	for (let i = 0; i < breakpointKeys.length; i++) {
		const key = breakpointKeys[i];
		if (width >= Number.parseInt(breakpoints[key])) {
			result = key;
		}
	}
	return result;
}

export function useBreakPoint() {
	const [bp, setBp] = useState<BreakPoints | null>(null);
	const isomorphicEffect = useIsomorphicEffect();
	isomorphicEffect(() => {
		const updateSize = (): void => {
			setBp(getCurrentBreakPoint());
		};

		window.addEventListener("resize", updateSize);
		updateSize();

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return bp;
}

export function useBreakPointValue<V>(values: BreakPointValues<V>): V {
	const breakPoint = useBreakPoint();
	const value = useMemo(() => {
		if (breakPoint === null) {
			return values.default;
		}
		let result = values.default;
		for (const [k, v] of Object.entries(values)) {
			result = v;
			if (k === breakPoint) {
				break;
			}
		}
		return result;
	}, [breakPoint, values]);
	return value;
}
