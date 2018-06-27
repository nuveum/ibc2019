import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ls from 'i18n';
import classNames from 'classnames';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Table from '../Table';
import TreeView from '../TreeView';

import styles from './styles.scss';

class Grid extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.object),
        columns: PropTypes.arrayOf(PropTypes.object),
        isAllChecked: PropTypes.bool,
        checkedPartially: PropTypes.bool,
        noCheckAll: PropTypes.bool,
        noSearch: PropTypes.bool,
        disabled: PropTypes.bool,
        style: PropTypes.object,
        headerRowRender: PropTypes.func,
        bodyRowRender: PropTypes.func,
        onCheckAll: PropTypes.func,
        onSearchTextChange: PropTypes.func,
    };

    static defaultProps = {
        data: [],
        columns: [],
        isAllChecked: false,
        checkedPartially: false,
        tree: false,
        noCheckAll: false,
        noSearch: false,
        disabled: false,
        style: null,
        headerRowRender: null,
        bodyRowRender: () => null,
        onCheckAll: () => null,
        onSearchTextChange: () => null,
    };

    render() {
        const {
            id,
            isAllChecked,
            onCheckAll,
            onSearchTextChange,
            checkedPartially,
            tree,
            noCheckAll,
            noSearch,
            disabled,
            style,
            ...rest
        } = this.props;

        return (
            <div
                className={classNames({
                    [styles.gridWrapper]: true,
                    [styles.disabled]: disabled
                })}
                style={style}
            >
                <div className={styles.gridControls}>
                    {!noCheckAll && <Checkbox
                        id={`${id}-all`}
                        onChange={onCheckAll}
                        checked={isAllChecked}
                        checkedPartially={checkedPartially}
                    />}
                    {!noSearch && <Input
                        placeholder={ls('SEARCH_PLACEHOLDER', 'Поиск')}
                        className={styles.gridSearch}
                        onChange={onSearchTextChange}
                    />}
                </div>
                <div className={styles.gridBody}>
                    <div className={styles.gridBodyInner}>
                        {tree ? <TreeView
                            id={id}
                            {...rest}
                        /> : <Table
                            id={id}
                            {...rest}
                        />}
                    </div>
                </div>
            </div>
        );
    }
}

export default Grid;
