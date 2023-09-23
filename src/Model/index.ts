export type ParamType = { [s: string]: string | number | boolean };
export type SendProps = {
	path: string;
	param?: ParamType;
	method?: string;
	headers?: HeadersInit;
	body?: BodyInit;
};
export default class Model {
	protected base_url: string = 'http://localhost/api';
	protected path: string = '/path/{required_parameters}/{optional_paramters?}';
	protected default_param: ParamType = {};
	protected default_headers: HeadersInit = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	constructor(default_param: ParamType | undefined = undefined, default_headers: HeadersInit | undefined = undefined) {
		if (default_param) this.default_param = { ...{}, ...default_param };
		if (default_headers) this, (default_headers = { ...{}, ...default_headers });
	}

	public generateUrl(path: string, param: ParamType = {}): string {
		param = { ...{}, ...param };

		//converting required parameters in path
		const url_params: string[] | null = path.match(/{[a-zA-Z]+}/gi);
		if (url_params !== null)
			url_params.forEach((paramName: string) => {
				let paramKey: string = paramName.replace(/{|}/gi, '');
				if (!param[paramKey]) throw new Error('Invalid parameter');
				path = path.replace(paramName, `${param[paramKey]}`);
				delete param[paramKey];
			});

		//converting optional parameters in path
		const url_params_opt: string[] | null = path.match(/{[a-zA-Z]+[?]}/gi);
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

	protected beforeSend(): void {}

	public async send(props: SendProps): Promise<Response> {
		this.beforeSend();

		const _option: RequestInit = {
			method: props.method || 'GET',
			headers: {
				...{},
				...this.default_headers,
				...(props.headers || {}),
			},
		};

		const _response = await fetch(this.generateUrl(props.path, props.param || {}), _option);
		if (!_response) throw new Error('Unexpected Error.');
		return _response;
	}
}
