import { clsx, type ClassValue } from "clsx";
import { format, fromUnixTime } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string | number) {
	return format(
		typeof timestamp === "string" ? timestamp : fromUnixTime(timestamp),
		"dd/MM/yyyy HH:mm",
	);
}
