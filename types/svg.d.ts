// SVG files are transformed into React components by `@svgr/webpack`
// (see the `turbopack.rules` entry in next.config.js), so the default
// export of an .svg import is the component itself.
declare module '*.svg' {
	import type { FC, SVGProps } from 'react';

	const ReactComponent: FC<SVGProps<SVGSVGElement>>;

	export default ReactComponent;
}
