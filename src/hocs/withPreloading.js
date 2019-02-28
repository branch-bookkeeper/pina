import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import PageHeader from '../components/PageHeader';
import PageTitle from '../components/PageTitle';

export default (isLoadingNeeded, load) => InnerComponent => {
    class ComponentWithPreloading extends Component {
        componentDidMount() {
            if (isLoadingNeeded(this.props)) {
                load(this.props);
            }
        }

        render() {
            return isLoadingNeeded(this.props)
                ? (
                    <PageHeader>
                        <PageTitle>
                            <CircularProgress />
                        </PageTitle>
                    </PageHeader>
                )
                : <InnerComponent {...this.props} />;
        }
    }

    ComponentWithPreloading.propTypes = Component.propTypes;

    return ComponentWithPreloading;
}
