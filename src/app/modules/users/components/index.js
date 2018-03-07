import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './styles.scss';
import ls from 'i18n';
import TabPanel from '../../../components/TabPanel';
import UserEditor from '../modules/UserEditor/containers';
import UsersTable from './UsersTable';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/Input/index';

class Users extends React.PureComponent {
    static childContextTypes = {
        history: PropTypes.object.isRequired,
    };

    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        usersData: PropTypes.array,
        isLoading: PropTypes.bool,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        usersData: [],
        isLoading: false,
        onMount: () => null,
    };

    getChildContext() {
        return {
            history: this.props.history,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onSearchTextChange = (searchText) => {
        this.setState({
            searchText,
        });
    };

    onAdd = () => {
        this.props.history.push('/users/add');
    }

    render() {
        const { match, history } = this.props;
        const { searchText } = this.state;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? String(params.id) : null;

        return (
            <TabPanel onTabClick={(tabId) => history && history.push(`${tabId}`)}
                      activeTabId="/users"
                      className={styles.usersContainer}>
                <div className={styles.usersWrapper}
                     id="/users"
                     tabTitle={ls('USERS_TAB_TITLE', 'Пользователи')}>

                    <div className={styles.controlsWrapper}>
                        <Icon icon="addIcon" onClick={this.onAdd} />
                        <Input placeholder={ls('SERCH_PLACEHOLDER', 'Поиск')}
                               className={styles.search}
                               onChange={e => this.onSearchTextChange(_.get(e, 'currentTarget.value', ''))}
                        />
                    </div>

                    <UsersTable
                        data={this.props.usersData}
                        searchText={searchText}
                    />

                    {isEditorActive && <UserEditor
                        active={isEditorActive}
                        userId={userId}
                    />}
                </div>
                <div id="/roles" tabTitle="Roles"/>
            </TabPanel>
        );
    }
}

export default Users;
