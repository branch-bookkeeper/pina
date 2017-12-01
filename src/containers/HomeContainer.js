import compose from 'ramda/src/compose';
import values from 'ramda/src/values';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import { connect } from 'react-redux';

import { isMade } from '../helpers/request';
import { loadRepositories } from '../redux/requests';

import withPreloading from '../hocs/withPreloading';
import Home from '../pages/Home';

const sortByFullName = sortBy(prop('full_name'));
const isLoadingNeeded = ({ repositoriesRequest }) => !isMade(repositoriesRequest);
const load = ({ loadRepositories, accessToken }) => loadRepositories(accessToken);

const mapStateToProps = ({
    requests: { repositories: repositoriesRequest },
    entities: { installations, repositories },
}) => ({
    repositoriesRequest,
    repositories: sortByFullName(values(repositories)),
});

const mapDispatchToProps = {
    loadRepositories,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withPreloading(isLoadingNeeded, load),
)(Home);
