Although a module is imported via dynamic imports, webpack doesn't create a separate chunk for it. See:

`src/components/route-a.jsx`:

```js
import(
	/* webpackChunkName: "comp-abc" */
	/* webpackMode: "lazy" */
	'./comp-abc.jsx'
)
```

# Setup & Commands
Switch to node `7.x.x` and install dependencies via `npm install`.

- to run dev:
	- `npm run dev`
	- navigate to `localhost:8000`
- to build `npm run build` and view files in `assets/`
- to run server `npm run server` and navigate to `localhost:8100` - requires running a build first