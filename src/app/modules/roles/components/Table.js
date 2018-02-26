import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Table from '../../../components/Table';
import { DefaultCell, LinkCell,CheckedCell } from '../../../components/Table/Cells';

class RolesTable extends React.PureComponent {
    static propTypes = {
        data: PropTypes.array,
        searchText: PropTypes.string,
        preloader: PropTypes.bool,
        onCheck: PropTypes.func,
    }

    static defaultProps = {
        data: [],
        searchText: '',
        preloader: false,
        onCheck: () => null,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked: [],
        };
    }

    onCheck = (value, node) => {
        let checked = [];
        if (node) {
            checked = value ? [...this.state.checked, node.id] : _.without(this.state.checked, node.id)
        } else {
            checked = value ? this.props.data.map(node => node.id) : [];
        }

        this.props.onCheck(checked);

        this.setState({
            checked,
        });
    }

    getColumns = () => ([{
        name: 'checked',
    }, {
        title: 'Название',
        name: 'name',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }, {
        title: 'Описание',
        name: 'description',
        searchable: true,
        sortable: true,
        filter: {
            type: 'text',
        },
    }
    ]);

    headerRowRender = (column, sortDirection) => {
        switch (column.name) {
            case 'checked': {
                const isAllChecked = this.props.data.length !== 0 && this.state.checked.length === this.props.data.length;
                return (
                    <CheckedCell
                        onChange={this.onCheck}
                        style={{ marginLeft: 0 }}
                        value={isAllChecked}
                    />
                );
            }
            default:
                return (
                    <DefaultCell
                        content={column.title}
                        sortDirection={sortDirection}
                    />
                );
        }
    }

    bodyRowRender = (column, node) => {
        const text = node[column.name];
        switch (column.name) {
            case 'checked': {
                const isRowChecked = this.state.checked.includes(node.id);
                return (
                    <CheckedCell
                        onChange={(value) => this.onCheck(value, node)}
                        style={{ marginLeft: 0 }}
                        value={isRowChecked}
                    />
                );
            }
            case 'name':
                return (
                    <LinkCell
                        href={`/roles/edit/${node.id}`}
                        content={text}
                    />
                );
            default:
                return (
                    <DefaultCell
                        content={text}
                    />
                );
        }
    }

    filter = (data, columns, searchText) => data.filter(node => columns.map(col => col.name).find(name => node[name].indexOf(searchText) !== -1));

    render() {
        const { data, searchText } = this.props;
        const columns = this.getColumns();
        const resultData = searchText ? this.filter(data, columns.filter(col => !!col.searchable), this.props.searchText) : data;
        return (
            <Table headerRowRender={this.headerRowRender}
                   bodyRowRender={this.bodyRowRender}
                   data={resultData}
                   columns={columns}/>
        );
    }
}

export default RolesTable;
