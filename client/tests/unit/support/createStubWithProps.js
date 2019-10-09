const extractProps = component => {
  const results = [].concat(
    (component.mixins || []).reduce(
      (acc, mixin) => acc.concat(extractProps(mixin)),
      []
    )
  );
  if (component.props) {
    results.push(
      ...(Array.isArray(component.props)
        ? component.props
        : Object.keys(component.props))
    );
  }
  return results;
};

const createStub = component => ({
  name: component.name,
  props: extractProps(component),
  template: "<div />"
});

export default createStub;
