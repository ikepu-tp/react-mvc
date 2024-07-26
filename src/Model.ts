import Send, { ErrorResource, SuccessOrFailedResponseResource } from './Send';
import Url, { ParamType } from './Url';

type PathParametersType = {
	optional_parameters?: string;
};
type RequiredParametersType = {
	required_paramters: string;
};
type beforeRequestMethod = 'index' | 'show' | 'store' | 'update' | 'destroy';
export type IndexParamProps = ParamType & {
	page?: number;
	per?: number;
};
export type ShowParamProps = ParamType & {};
export type StoreParamProps = ParamType & {};
export type UpdateParamProps = ParamType & {};
export type DeleteParamProps = ParamType & {};
export default class Model<
	defaultResponse = SuccessOrFailedResponseResource,
	PPT = PathParametersType,
	Resource = any,
	StoreResource = any,
	UpdateResource = any,
	IPP = IndexParamProps,
	SPP = ShowParamProps,
	StPP = StoreParamProps,
	UPP = UpdateParamProps,
	DPP = DeleteParamProps,
	RequiredParameters = RequiredParametersType,
	DeleteResource = any,
	errorResource = ErrorResource,
> {
	protected url: Url | null = null;
	protected send: Send | null = null;
	protected base_url: string = '/api';
	protected path: string = '/path/{required_parameters}/{optional_paramters?}';

	/**
	 *
	 * @param default_param パラメータ初期値
	 * @param default_headers リクエストヘッダ初期値
	 */
	constructor(
		default_param: ParamType | undefined = undefined,
		default_headers: { [s: string]: string } | undefined = undefined
	) {
		if (this.url === null) this.url = new Url();
		this.url.setBaseUrl(this.base_url);
		if (this.send === null) this.send = new Send<defaultResponse>(this.url);
		if (default_param) this.send.setDefaultParam(default_param);
		if (default_headers) this.send.setDefaultHeaders(default_headers);
	}

	public setPath(path: string): void {
		this.path = path;
	}

	public convertNullResponse(): void {
		throw new Error('Unexpected response.');
	}

	public convertResponse<P = Resource | errorResource>(response: defaultResponse | null): P {
		if (response === null) {
			this.convertNullResponse();
			return response as P;
		}
		if (!response) throw new Error('Unexpected response.');
		const _response: defaultResponse & { payloads?: any; error?: any } = response;
		if (_response.payloads) return _response.payloads;
		if (_response.error) return _response.error;
		throw new Error('Not found response.');
	}

	/**
	 * リクエスト前処理
	 *
	 * @param {beforeRequestMethod} method
	 * @memberof Model
	 */
	public beforeRequest(method: beforeRequestMethod): void {
		switch (method) {
			default:
		}
	}

	/**
	 * リクエスト後処理
	 *
	 * @memberof Model
	 */
	public afterRequest<P = Resource | errorResource>(_response: defaultResponse | P | null): void {}

	public async index<P = Resource | errorResource, Param = ParamType | (ParamType & PPT & RequiredParameters & IPP)>(
		params: Param | undefined = undefined
	): Promise<P> {
		this.beforeRequest('index');

		if (this.send === null) throw new Error('Sned is null');

		const _response: defaultResponse | null = await this.send.get<defaultResponse, Param>({
			path: this.path,
			param: params,
		});

		const res = this.convertResponse<P>(_response);
		this.afterRequest<P>(res);

		return res;
	}

	public async show<P = Resource | errorResource, Param = ParamType | (ParamType & PPT & RequiredParameters & SPP)>(
		params: Param | undefined = undefined
	): Promise<P> {
		this.beforeRequest('show');

		if (this.send === null) throw new Error('Sned is null');

		const _response: defaultResponse | null = await this.send.get<defaultResponse, Param>({
			path: this.path,
			param: params,
		});

		const res = this.convertResponse<P>(_response);
		this.afterRequest<P>(res);

		return res;
	}

	public async store<P = Resource | errorResource, Param = ParamType | (ParamType & PPT & RequiredParameters & StPP)>(
		resource: StoreResource,
		params: Param | undefined = undefined
	): Promise<P> {
		this.beforeRequest('store');

		if (this.send === null) throw new Error('Sned is null');

		const _response: defaultResponse | null = await this.send.post<defaultResponse, Param>({
			path: this.path,
			param: params,
			body: JSON.stringify(resource),
		});

		const res = this.convertResponse<P>(_response);
		this.afterRequest<P>(res);

		return res;
	}

	public async update<P = Resource | errorResource, Param = ParamType | (ParamType & PPT & RequiredParameters & UPP)>(
		resource: UpdateResource,
		params: Param | undefined = undefined
	): Promise<P> {
		this.beforeRequest('update');

		if (this.send === null) throw new Error('Sned is null');

		const _response: defaultResponse | null = await this.send.put<defaultResponse, Param>({
			path: this.path,
			param: params,
			body: JSON.stringify(resource),
		});

		const res = this.convertResponse<P>(_response);
		this.afterRequest<P>(res);

		return res;
	}

	public async destroy<P = Resource | errorResource, Param = ParamType | (ParamType & PPT & RequiredParameters & DPP)>(
		resource: DeleteResource | undefined = undefined,
		params: Param | undefined = undefined
	): Promise<P> {
		this.beforeRequest('destroy');

		if (this.send === null) throw new Error('Sned is null');

		const _response: defaultResponse | null = await this.send.delete<defaultResponse, Param>({
			path: this.path,
			param: params,
			body: JSON.stringify(resource),
		});

		const res = this.convertResponse<P>(_response);
		this.afterRequest<P>(res);

		return res;
	}
}
