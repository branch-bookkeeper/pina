import React, { Component } from 'react';

export default (isLoadingNeeded, load) => InnerComponent => {
    class ComponentWithPreloading extends Component {
        componentDidMount() {
            if (isLoadingNeeded(this.props)) {
                load(this.props);
            }
        }

        render() {
            return isLoadingNeeded(this.props)
                ? <div>Loading...</div>
                : <InnerComponent {...this.props} />;
        }
    }

    ComponentWithPreloading.propTypes = Component.propTypes;

    return ComponentWithPreloading;
}
