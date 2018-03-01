import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { Button } from 'reactstrap';
import ls from 'i18n';
import TabPanel from '../../../components/TabPanel';
import UserEditor from '../modules/UserEditor/containers';
import UsersTable from './UsersTable';

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

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    onAdd = () => {
        this.props.history.push('/users/add');
    }

    render() {
        const { match, history } = this.props;
        const { params } = match;

        const isEditorActive = params.action === 'edit' || params.action === 'add';
        const userId = params.id ? String(params.id) : null;

        return (
            <TabPanel onTabClick={(tabId) => history && history.push(`${tabId}`)}
                      activeTabId="/users">
                <div className={styles.usersWrapper}
                     id="/users"
                     tabTitle={ls('USERS_TAB_TITLE', 'Пользователи')}>
                    <div className={styles.controlsWrapper}>
                        <Button color="primary" onClick={this.onAdd}>Добавить</Button>
                        <Button color="primary">Заблокировать</Button>
                        <Button color="primary">Разблокировать</Button>
                    </div>
                    <UsersTable
                        data={this.props.usersData}
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
