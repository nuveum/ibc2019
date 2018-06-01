import React from 'react';
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ls from 'i18n';
import _ from "lodash";
import momentTz from 'moment-timezone';

import { resetActiveUserSuccess } from '../actions';
import PageWrapper from '../components/PageWrapper';
import Preloader from '../components/Preloader';
import Login from '../modules/login/containers';
import Dasboard from '../modules/dashboard/containers';
import Policies from '../modules/policies/containers';
import Reports from '../modules/reports/containers';
import StbLoading from '../modules/stb-loading/components';
import KQI from '../modules/kqi/containers';
import Sources from '../modules/sources/containers';
import Alarms from '../modules/alarms/containers';
import UsersAndRoles from '../modules/usersAndRoles/components';
import rest from '../rest';
import { fetchActiveUserSuccess } from "../actions/index";
import { LOGIN_SUCCESS_RESPONSE } from "../costants/login";
import { setGlobalTimezone } from '../util/date';


const noMatchStyle = {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 22,
};

const NoMatch = () => (
    <div style={noMatchStyle}>{ls('PAGE_NOT_FOUND', 'Страница не найдена')}</div>
);

class App extends React.Component {

    static propTypes = {
        onFetchUserSuccess: PropTypes.func,
        onLogOut: PropTypes.func,
    };

    static defaultProps = {
        onFetchUserSuccess: () => null,
        onLogOut: () => null,
    };

    getMapedSubjects = () => {
        return {
            'LOGIN': {
                title: 'Выход',
                link: '/login',
                path: '/login',
                exact: true,
                component: Login
            },
            'LANDING': {
                title: 'Рабочий стол',
                path: '/',
                link: '/',
                component: Dasboard,
                exact: true
            },
            'KQI': {
                title: 'KPI/KQI',
                link: '/kqi',
                path: "/kqi/:action?/:configId?/:projectionId?/:resultId?",
                component: KQI
            },
            'POLICY': {
                title: 'Политики',
                link: '/policies',
                path: "/policies/:action?/:id?",
                component: Policies
            },
            'ALARMS': {
                title: 'Аварии',
                link: '/alarms/gp',
                path: "/alarms/:type/:id?",
                component: Alarms
            },
            'REPORTS': {
                title: 'Отчётность',
                link: '/reports',
                path: '/reports/:action?',
                component: Reports
            },
            'SOURCES': {
                title: 'Источники',
                link: '/sources',
                path: "/sources",
                component: Sources
            },
            'USERS': {
                title: 'Работа с пользователями',
                link: '/users-and-roles/users',
                path: "/users-and-roles/:page/:action?/:id?",
                component: UsersAndRoles
            },
            'ROLES': {
                title: 'Работа с пользователями',
                link: '/roles',
                path: "/roles/:action?/:id?",
                component: UsersAndRoles
            },
            'STB_LOADING': {
                title: 'Время загрузки STB',
                link: '/stb-loading',
                path: "/stb-loading",
                component: StbLoading
            }
        }
    };

    static childContextTypes = {
        fetchUserSuccess: PropTypes.func.isRequired,
    };

    getChildContext = () => ({
        fetchUserSuccess: this.onFetchUserSuccess,
    });

    constructor(props) {
        super(props);
        rest.onResponseCode('401', this.navigateLogin);
        rest.onResponseCode('403', this.navigateLogin); //todo: Должен быть 401
        rest.onResponseCode('200', this.refreshToken);
        this.setToken();
        this.state = { loading: true, loggedIn: false };
    }

    onLogOut = () => {
        this.dropToken();
        this.props.history.push('/login');
        this.setState({ loggedIn: false }, () => this.props.onLogOut())
    };

    setToken = (token) => {
        const localToken = localStorage.getItem('jwtToken');
        if (token !== localToken) {
            localStorage.setItem('jwtToken', token || localToken);
            rest.setCommonHeader('Authorization', token || localToken);
        }
    };

    dropToken = () => {
        localStorage.removeItem('jwtToken');
        rest.setCommonHeader('Authorization', null);
    };

    menuSorter = (subjA, subjB, menuOrder) => {
        return menuOrder.findIndex(item => item === subjA) - menuOrder.findIndex(item => item === subjB);
    };

    componentDidMount() {
        this.setState({ loading: true });
        rest.get('api/v1/user/current')
            .then((userResp) => {
                const user = userResp.data || {};
                if (user.time_zone) {
                    setGlobalTimezone(user.time_zone);
                } else {
                    setGlobalTimezone(momentTz.tz.guess());
                }
                this.onFetchUserSuccess(user);
                this.setState({ loading: false, loggedIn: true });
            })
            .catch(() => {
                this.props.onFetchUserSuccess({
                    subjects: this.getCommonRoutes(),
                });
                this.setState({ loading: false, loggedIn: false });
            });
    }

    onFetchUserSuccess = (user) => {
        const subjectMap = this.getMapedSubjects() || {};
        const commonSubjects = this.getCommonRoutes();
        const totalSubjects = user.subjects.concat(commonSubjects);
        const menuOrder = Object.keys(subjectMap);
        user.subjects = _.uniqBy(totalSubjects, sbj => sbj.name.toUpperCase());
        user.menu = user.subjects
            .filter(subject => subject.name !== 'LOGIN' && subject.name.toUpperCase() !== 'ROLES')
            .sort((subjA, subjB) => this.menuSorter(subjA.name.toUpperCase(), subjB.name.toUpperCase(), menuOrder))
            .map(subject => ({
                title: subjectMap[subject.name.toUpperCase()].title,
                link: subjectMap[subject.name.toUpperCase()].link,
            }));
        this.props.onFetchUserSuccess(user);
    };

    refreshToken = (response) => {
        const token = response.headers[LOGIN_SUCCESS_RESPONSE.AUTH];
        this.setToken(token);
    };

    saveState = () => {
        //todo: Сделать сохранение стейта, при протухании токена
    };

    navigateLogin = () => {
        this.saveState();
        this.onLogOut()
    };

    getCommonRoutes = () => [
        {
            id: 'users-page',
            name: 'USERS',
            link: '/users-and-roles/users'
        },
        {
            id: 'reports-page',
            name: 'REPORTS',
            link: '/reports'
        },
        {
            id: 'alarms',
            name: 'ALARMS',
            link: '/alarms/gp'
        },
        {
            id: 'login-page',
            name: 'LOGIN',
            link: '/login'
        },
        {
            id: 'landing-page',
            name: 'LANDING',
            link: '/'
        },
        {
            id: 'sources-page',
            name: 'SOURCES',
            link: '/sources'
        },
    ];

    renderRoutes = (subjects = []) => {
        const subjectMap = this.getMapedSubjects() || {};
        return subjects.map(subject => {
            const config = subjectMap[subject.name.toUpperCase()];
            return config ? <Route
                key={subject.name} {...config}/> : null
        });
    };

    loginRedirect = () => <Route render={() => {
        this.props.history.push('/login');
        return null
    }}/>;

    render() {
        const { user = {} } = this.props;
        const { subjects } = user;
        const { loading, loggedIn } = this.state;
        const routes = this.renderRoutes(subjects);
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Preloader active={this.state.loading}>
                    {!loading && <PageWrapper onLogOut={this.onLogOut}>
                        <Switch>
                            {routes}
                            {loggedIn ? <Route component={NoMatch}/> : this.loginRedirect()}
                        </Switch>
                    </PageWrapper>}
                </Preloader>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => ({
    onFetchUserSuccess: user => dispatch(fetchActiveUserSuccess(user)),
    onLogOut: () => dispatch(resetActiveUserSuccess()),
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));