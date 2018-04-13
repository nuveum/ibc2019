import React from 'react';
import PropTypes from 'prop-types';
import ls from 'i18n';
import moment from 'moment';
import _ from 'lodash';
import Panel from '../../../../../components/Panel';
import Radio from '../../../../../components/Radio';
import Checkbox from '../../../../../components/Checkbox';
import Field from '../../../../../components/Field';
import DateTimePicker from '../../../../../components/DateTimePicker';
import Select from '../../../../../components/Select';
import styles from './styles.scss';

const INTERVALS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    OTHER: 'other',
};

class Period extends React.PureComponent {
    static propTypes = {
        groupingOptions: PropTypes.array,
        onIntervalChange: PropTypes.func,
        onGroupingTypeChange: PropTypes.func,
        onAutoGenChange: PropTypes.func,
        errors: PropTypes.object,
        isAutoGen: PropTypes.bool,
    };

    static defaultProps = {
        groupingOptions: [],
        onIntervalChange: () => null,
        onGroupingTypeChange: () => null,
        onAutoGenChange: () => null,
        errors: null,
        isAutoGen: false,
    };

    static mapObjectToOptions(object) {
        return _.map(object, (title, value) => ({ value, title }));
    }

    constructor(props) {
        super(props);

        this.state = {
            start: null,
            end: null,
            interval: INTERVALS.OTHER,
            isGroupingChecked: false,
            groupingOptions: [],
            groupingType: null,
        };
    }

    getFilteredGroupingOptions = (start, end, groupingOptions) => {
        if (!start || !end) return [];
        if (moment(end).diff(moment(start), 'month') >= 1) {
            return groupingOptions;
        } else if (moment(end).diff(moment(start), 'weeks') >= 1) {
            return groupingOptions.filter(opt => opt.value !== 'MONTH');
        } else if (moment(end).diff(moment(start), 'days') >= 1) {
            return groupingOptions.filter(opt => opt.value === 'DAY');
        } else {
            return [];
        }
    };

    configureAndSetState = (start, end, interval) => {
        const groupingOptions = this.getFilteredGroupingOptions(start, end, this.props.groupingOptions);
        const groupingType = !groupingOptions.find(opt => opt.value === this.state.groupingType)
            ? _.get(groupingOptions, '0.value', null)
            : this.state.groupingType;

        this.setState({
            start,
            end,
            interval,
            groupingOptions,
            groupingType,
        });

        const sentGroupingType = this.state.isGroupingChecked ? groupingType : null;
        this.props.onIntervalChange(start, end, interval.toUpperCase(), sentGroupingType);
    };

    onStartChange = (start) => {
        const { end } = this.state;
        this.configureAndSetState(start, end, INTERVALS.OTHER);
    };

    onEndChange = (end) => {
        const { start } = this.state;
        this.configureAndSetState(start, end, INTERVALS.OTHER);
    };

    onGroupingCheck = (value) => {
        if (value) {
            this.props.onGroupingTypeChange(this.state.groupingType);
        } else {
            this.props.onGroupingTypeChange(null);
        }

        this.setState({ isGroupingChecked: value });
    };

    onGroupingTypeChange = (value) => {
        if (this.state.isGroupingChecked) {
            this.setState({ groupingType: value });
            this.props.onGroupingTypeChange(value);
        }
    };

    onIntervalChange = (interval, value) => {
        if (value) {
            const start = interval !== INTERVALS.OTHER ?  moment().subtract(1, interval).startOf(interval).toDate() : this.state.start;
            const end = interval !== INTERVALS.OTHER ?  moment(start).endOf(interval).toDate() : this.state.end;
            this.configureAndSetState(start, end, interval);
        }
    };

    render() {
        const { errors } = this.props;

        return (
            <Panel
                title={ls('KQI_CALCULATOR_PERIOD_TITLE', 'Период')}
            >
                <div className={styles.kqiPeriod}>
                    <Field
                        id="day-interval"
                        labelText={ls('TIME_INTERVAL_DAY', 'День')}
                        inputWidth={15}
                        labelAlign="right"
                    >
                        <Radio
                            id="day-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.DAY}
                            onChange={v => this.onIntervalChange(INTERVALS.DAY, v)}
                        />
                    </Field>
                    <Field
                        id="week-interval"
                        labelText={ls('TIME_INTERVAL_WEEK', 'Неделя')}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="week-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.WEEK}
                            onChange={v => this.onIntervalChange(INTERVALS.WEEK, v)}
                        />
                    </Field>
                    <Field
                        id="month-interval"
                        labelText={ls('TIME_INTERVAL_MONTH', 'Месяц')}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="month-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.MONTH}
                            onChange={v => this.onIntervalChange(INTERVALS.MONTH, v)}
                        />
                    </Field>
                    <Field
                        id="other-interval"
                        labelText={`${ls('TIME_INTERVAL_OTHER', 'Другое')}:`}
                        inputWidth={15}
                        labelAlign="right"
                        style={{
                            marginTop: 0,
                            marginLeft: 10,
                        }}
                    >
                        <Radio
                            id="other-interval"
                            name="time-interval"
                            checked={this.state.interval === INTERVALS.OTHER}
                            onChange={v => this.onIntervalChange(INTERVALS.OTHER, v)}
                        />
                    </Field>
                    <DateTimePicker
                        value={this.state.start}
                        max={this.state.end}
                        onChange={this.onStartChange}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        time
                        valid={errors && _.isEmpty(errors.start_date_time)}
                    />
                    <DateTimePicker
                        value={this.state.end}
                        min={this.state.start}
                        onChange={this.onEndChange}
                        inputWidth={90}
                        format={'DD.MM.YYYY HH:mm'}
                        style={{ marginLeft: 15 }}
                        time
                        valid={errors && _.isEmpty(errors.end_date_time)}
                    />
                    <div className={styles.groupingBlock}>
                        <Checkbox
                            id="date-time-grouping-check"
                            checked={this.state.isGroupingChecked}
                            onChange={this.onGroupingCheck}
                            style={{ marginLeft: 30 }}
                        />
                        <Field
                            id="date-time-grouping"
                            labelText={ls('KQI_CALCULATOR_GROUPING_FIELD_LABEL', 'С группировкой по')}
                            labelWidth="38%"
                            inputWidth="62%"
                            style={{
                                flexGrow: 1,
                            }}
                        >
                            <Select
                                id="date-time-grouping"
                                value={this.state.groupingType}
                                options={this.state.groupingOptions}
                                onChange={this.onGroupingTypeChange}
                                disabled={!this.state.isGroupingChecked}
                                noEmptyOption
                            />
                        </Field>
                    </div>
                </div>
                <Field
                    id="auto-checkbox"
                    labelText={ls('KQI_CALCULATOR_AUTOGEN_FIELD_LABEL', 'Автовычисление')}
                    labelWidth="98%"
                    inputWidth="2%"
                    labelAlign="right"
                >
                    <Checkbox
                        id="auto-checkbox"
                        checked={this.props.isAutoGen}
                        onChange={this.props.onAutoGenChange}
                    />
                </Field>
            </Panel>
        );
    }
}

export default Period;
