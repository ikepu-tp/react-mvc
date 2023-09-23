# React MVC

React MVC is a library for supporting MVC-like implementations in JavaScript projects.

## How to use

### Installation

```bash
npm install @ikepu-tp/react-mvc
```

### Model

```javascript:sample.js
import Model from "@ikepu-tp/react-mvc"

class NewModel extends Model<ResponseResource>
{
  protected base_url: string = 'http://localhost/api';
  protected path: string = '/path/{required_parameters}/{optional_paramters?}';
}
```

## Contributing

We welcome contributions to the project! You can get involved through the following ways:

[Issue](https://github.com/ikepu-tp/react-mvc/issues): Use for bug reports, feature suggestions, and more.
[Pull Requests](https://github.com/ikepu-tp/react-mvc/pulls): We encourage code contributions for new features and bug fixes.

## License

See [LICENSE](./LICENSE).
