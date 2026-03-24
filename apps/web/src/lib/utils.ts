import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper for Select onValueChange when using useState.
 * Wraps setState to handle null values from Select component.
 * @example
 * const [value, setValue] = useState("default")
 * <Select onValueChange={selectHandler(setValue, "default")}>
 */
export function selectHandler(
  setState: React.Dispatch<React.SetStateAction<string>>,
  defaultValue: string
): (value: string | null) => void {
  return (value) => setState(value ?? defaultValue);
}
