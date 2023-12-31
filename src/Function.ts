export default class Function {
	/**
	 * get all cookies
	 *
	 * @export
	 * @return {{[s:string]:string}}
	 */
	public static cookies(): { [s: string]: string } {
		let all_cookies: { [s: string]: string } = {};
		document.cookie.split('; ').forEach(function (value: string): void {
			let tmp_cookie: string[] = value.split('=');
			all_cookies[tmp_cookie[0]] = decodeURIComponent(tmp_cookie[1]);
		});
		return all_cookies;
	}

	/**
	 * get a cookie
	 *
	 * @export
	 * @param {string} key
	 * @param {any} _default
	 * @return {(string | any)}
	 */
	public static cookie(key: string, _default: any = null): string | any {
		let all_cookies: { [s: string]: string } = Function.cookies();
		return all_cookies[key] || _default;
	}

	/**
	 * create a random strings
	 *
	 * @export
	 * @return {*}  {string}
	 */
	public static createKey(): string {
		return Math.random().toString(32).substring(2);
	}

	/**
	 * character string query
	 *
	 * @param value
	 * @returns
	 */
	public static isString(value: any): boolean {
		return typeof value === 'string' || value instanceof String;
	}
}
