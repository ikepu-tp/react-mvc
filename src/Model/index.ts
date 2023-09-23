import Send, { ResponseResource } from './../Send';
import Url, { ParamType } from './../Url';

export default class Model<defaultResponse = ResponseResource> {
	protected url: Url = new Url();
	protected send: Send = new Send<defaultResponse>();
	protected base_url: string = '/api';
	protected path: string = '/path/{required_parameters}/{optional_paramters?}';

	constructor(
		default_param: ParamType | undefined = undefined,
		default_headers: { [s: string]: string } | undefined = undefined
	) {
		if (default_param) this.send.setDefaultParam(default_param);
		if (default_headers) this.send.setDefaultHeaders(default_headers);
		this.url.setBaseUrl(this.base_url);
	}
}
