import React = require('react');

// Declare a module for SVG files
declare module '*.svg' {
	// Export a React component for the SVG
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	// Export the SVG file's source as a string
	const src: string;
	export default src;
}
