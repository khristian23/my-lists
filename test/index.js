// Skip execution in Node
let context

if (module.hot) {
    context = require.context(
      "mocha-loader!./", // Process through mocha-loader
      false, // Skip recursive processing
      /\.spec\.js$/ // Pick only files ending with .spec.js
    );
  } else {
    context = require.context('.', true, /.+\.spec\.js?$/);
  }

  // Execute each test suite
  context.keys().forEach(context);
  module.exports = context;