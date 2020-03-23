module.exports = function() {
  return {
    visitor: {
      ImportDeclaration(path) {
        const value = path.node.source.value;
        if (/\.less$/.test(value)) {
          path.node.source.value = value.replace('less', 'css');
        }
      },
    },
  };
};
