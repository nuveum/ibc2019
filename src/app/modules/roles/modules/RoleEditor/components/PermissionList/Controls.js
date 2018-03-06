import React from 'react';
import PropTypes from 'prop-types';
import Controls, { Control, Left } from 'qreact/lib/Table/Controls/Controls';
import { Checkbox, TextInputTypeahead as Search } from 'qreact';
import styles from './styles.scss';

class RolesListControls extends React.PureComponent {
    static propTypes = {
        onSearchTextChange: PropTypes.func,
        onCheckAll: PropTypes.func,
        isAllChecked: PropTypes.bool,
    };

    static defaultProps = {
        isAllChecked: false,
        onSearchTextChange: () => null,
        onCheckAll: () => null,
    };

    render() {
        const { isAllChecked } = this.props;
        return (
            <Controls>
                <Left>
                    <Control>
                        <Checkbox
                            id="permissions-all"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 33,
                                height: '100%',
                                cursor: 'pointer',
                                marginBottom: 0,
                            }}
                            onChange={this.props.onCheckAll}
                            checked={isAllChecked}
                        />
                    </Control>
                </Left>
                <Search
                    onChange={this.props.onSearchTextChange}
                    className={styles.search}
                    placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                />
            </Controls>
        );
    }
}

export default RolesListControls;