import { cookie, createKey } from 'src/functions';

export type ParamType = { [s: string]: string | number | boolean };
export type SendGetProps = {
	path: string;
	param?: ParamType;
	headers?: HeadersInit;
};
export type SendPostProps = SendGetProps & {
	body?: BodyInit;
};
export type SendPutProps = SendPostProps;
export type SendPatchProps = SendPostProps;
export type SendDeleteProps = SendPostProps;
export type SendProps = SendGetProps & {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: BodyInit;
};

export type ResponseResource = {
	status: {
		result: boolean;
		code: number;
		nonce: string;
	};
};
export default class Model<defaultResponse = ResponseResource> {
	protected base_url: string = 'http://localhost/api';
	protected path: string = '/path/{required_parameters}/{optional_paramters?}';
	protected default_param: ParamType = {};
	protected default_headers: HeadersInit & { [s: string]: string } = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};

	constructor(
		default_param: ParamType | undefined = undefined,
		default_headers: { [s: string]: string } | undefined = undefined
	) {
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

	protected beforeSend(): void {
		this.default_headers['X-XSRF-TOKEN'] = cookie('XSRF-TOKEN', '');
		this.default_headers['X-NONCE'] = createKey();
	}

	protected afterSend<R = defaultResponse>(response: R | null, headers: Headers): void {
		if (headers.get('Request-Nonce') !== this.default_headers['X-NONCE']) throw new Error('Unexpected response.');
	}

	public async send<R = defaultResponse>(props: SendProps): Promise<R | null> {
		this.beforeSend();

		const _option: RequestInit = {
			method: props.method || 'GET',
			headers: {
				...{},
				...this.default_headers,
				...(props.headers || {}),
			},
		};

		const _response: Response = await fetch(this.generateUrl(props.path, props.param || {}), _option);
		const _response_body: R | null = await _response.json();
		const _response_header: Headers = _response.headers;

		this.afterSend(_response_body, _response_header);

		return _response_body;
	}

	public async sendGet<R = defaultResponse>(props: SendGetProps): Promise<R | null> {
		return this.send<R>({ method: 'GET', ...props });
	}

	public async sendPost<R = defaultResponse>(props: SendPostProps): Promise<R | null> {
		return this.send<R>({ method: 'POST', ...props });
	}

	public async sendPut<R = defaultResponse>(props: SendPutProps): Promise<R | null> {
		return this.send<R>({ method: 'PUT', ...props });
	}

	public async sendPatch<R = defaultResponse>(props: SendPatchProps): Promise<R | null> {
		return this.send<R>({ method: 'PATCH', ...props });
	}

	public async sendDelete<R = defaultResponse>(props: SendDeleteProps): Promise<R | null> {
		return this.send<R>({ method: 'DELETE', ...props });
	}
}
