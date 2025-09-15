const React = require('react');
module.exports = React.forwardRef((props, ref) => React.createElement('svg', { ...props, ref }));
