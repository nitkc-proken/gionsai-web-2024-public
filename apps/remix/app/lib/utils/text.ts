/**
 * 文字列の先頭に '0' を追加して指定した長さになるようにします。
 *
 * @param {number | string} value - '0'を追加する対象の数字/文字列です。
 * @param {number} length - 文字列の望ましい長さです。もし文字列がすでにこの長さより長ければ、何も変更されません。
 * @returns {string} '0'が前方に追加された文字列です。もし元の文字列の長さが指定した長さより長い場合、元の文字列がそのまま返されます。
 */
export function zeroPadding(value: number | string, length: number): string {
	return String(value).padStart(length, "0");
}
