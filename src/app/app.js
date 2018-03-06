import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './scss/style.scss';

import Login from './modules/login/containers';
import Roles from './modules/roles/containers';
import Users from './modules/users/container';
import Policies from './modules/policies/containers';
import rootReducer from './reducers';
import PageWrapper from "./components/PageWrapper/index";
import Notification from "./components/Notification";


class App extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Route path="/login" render={props => {
                    props.location.title = 'Логин';
                    return <Login {...props}/>
                }}/>
                <Route path="/roles/:action?/:id?" component={Roles}/>
                <Route path="/users/:action?/:id?" component={Users}/>
                <Route path="/policies/:action?/:id?" component={Policies}/>
            </div>
        );
    }
}

const store = createStore(rootReducer);

function getCookie() {
    return document.cookie;
}
function updateMessage() {
    let text = getCookie();
    console.log(text);
}
setTimeout(updateMessage, 1000);

const renderRootComponent = () => {
    ReactDOM.render(
        <Notification>
            <Provider store={store}>
                <BrowserRouter>
                    <PageWrapper>
                        <App/>
                    </PageWrapper>
                </BrowserRouter>
            </Provider>
        </Notification>,
        document.getElementById('app-root')
    );
};

renderRootComponent();
