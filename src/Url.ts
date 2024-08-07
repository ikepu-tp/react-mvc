export type ParamType = { [s: string | number | symbol]: any };
export default class Url {
	protected base_url: string = '/api';

	constructor(base_url: string | undefined = undefined) {
		if (base_url) this.setBaseUrl(base_url);
	}

	public setBaseUrl(base_url: string) {
		this.base_url = base_url;
	}

	public generateUrl<Param = ParamType>(path: string, params: Param | undefined = undefined): string {
		let param: ParamType = { ...{}, ...(params || {}) };

		//converting required parameters in path
		const url_params: string[] | null = path.match(/{[a-zA-Z_]+}/gi);
		if (url_params !== null)
			url_params.forEach((paramName: string) => {
				let paramKey: string = paramName.replace(/{|}/gi, '');
				if (!param[paramKey]) throw new Error(`Invalid parameter. Cannot find "${paramKey}". Sent ${JSON.stringify(param)}`);
				path = path.replace(paramName, `${param[paramKey]}`);
				delete param[paramKey];
			});

		//converting optional parameters in path
		const url_params_opt: string[] | null = path.match(/{[a-zA-Z_]+[?]}/gi);
		if (url_params_opt !== null)
			url_params_opt.forEach((paramName: string) => {
				let paramKey: string = paramName.replace(/[{|}|?]/gi, '');
				path = path.replace(paramName, param[paramKey] ? `${param[paramKey]}` : '');
				delete param[paramKey];
			});

		return this.createUrl(path, param);
	}

	public createUrl(path: string, param: ParamType = {}): string {
		return (
			`${this.base_url.replace(/\/$/, '')}/${path.replace(/^\//, '')}`.replace(/\/$/, '') +
			(Object.keys(param).length ? `?${this.createQuery(param)}` : '')
		);
	}

	public createQuery(param: ParamType): string {
		let queries: string[] = [];
		Object.keys(param).forEach(function (key) {
			queries.push(`${key}=${param[key]}`);
		});
		return queries.join('&');
	}
}
