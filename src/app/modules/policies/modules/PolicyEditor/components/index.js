import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'reactstrap';
import Input from '../../../../../components/Input';
import Select from '../../../../../components/Select';
import Field from '../../../../../components/Field';
import ls from 'i18n';
import Configuration from './Configuration';
import Condition from './Condition';
import styles from './styles.scss';

class PolicyEditor extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object.isRequired,
    }

    static propTypes = {
        policyId: PropTypes.number,
        policy: PropTypes.object,
        active: PropTypes.bool,
        onSubmit: PropTypes.func,
        onClose: PropTypes.func,
        onMount: PropTypes.func,
    };

    static defaultProps = {
        policyId: null,
        policy: null,
        active: false,
        onSubmit: () => null,
        onClose: () => null,
        onMount: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            policy: props.policy || {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.policy, this.props.policy)) {
            this.setState({policy: nextProps.policy});
        }
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }


    getPolicyProperty = (key, defaultValue) => _.get(this.state.policy, key, defaultValue);

    setPolicyProperty = (key, value) => {
        const policyValues = _.set({}, key, value);
        const policy = _.merge(
            {},
            this.state.policy,
            policyValues,
        );

        this.setState({
            policy,
        });
    }

    onClose = () => {
        this.context.history.push('/policies');
        this.props.onClose();
    };

    onSubmit = () => {
        if (typeof this.props.onSubmit === 'function') {
            // this.props.onSubmit(this.props.userId, this.state.user);
            this.props.onSubmit(this.props.policyId, this.state.policy);
        }
    };


    render() {
        const { active, policyId } = this.props;
        const {policy} = this.state;
        const modalTitle = policyId ? ls('POLICIES_EDIT', 'Редактировать политику') :  ls('POLICIES_ADD', 'Создать политику');
        return (
            <Modal isOpen={active} size="lg">
                <ModalHeader toggle={this.onClose}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <div className={styles.roleEditorContent}>
                        <div className={styles.roleEditorColumn}>
                            <Configuration/>


                            <div className={styles.panel}>
                                <h6 className={styles.panelHeader}>{ls('POLICIES_SCOPE_TITLE', 'Область применения')}</h6>
                                <div className={styles.panelBody}>
                                    <Field
                                        id="iField"
                                        inputWidth="100%"
                                    >
                                        <Select
                                            id="iField"
                                            type="select"
                                            options={[]}
                                            onChange={() => {}}
                                        />
                                    </Field>
                                    <Field
                                        id="jField"
                                        inputWidth="100%"
                                    >
                                        <Select
                                            id="jField"
                                            type="select"
                                            options={[]}
                                            onChange={() => {}}
                                        />
                                    </Field>
                                </div>
                            </div>
                            <div className={styles.panel}>
                                <h6 className={styles.panelHeader}>{ls('POLICIES_END_OF_ACCIDENT_TITLE', 'Окончание аварии')}</h6>
                                <div className={styles.panelBody}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <div style={{ width: '70%' }}>
                                            <Field
                                                id="cease_duration"
                                                labelText={ls('POLICIES_ADD', 'Создать политику')}"Интервал агрегации:"
                                                labelWidth="67%"
                                                inputWidth="33%"
                                            >
                                                <Input
                                                    id="interval"
                                                    name="interval"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.cease_duration')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.cease_duration', Number(e.currentTarget.value))}
                                                />
                                            </Field>
                                        </div>
                                        <div style={{ width: '30%' }}>
                                            <Field
                                                id="cease_value"
                                                labelText={ls('POLICIES_THRESHOLD', 'Порог:')}
                                            >
                                                <Input
                                                    id="threshold"
                                                    name="threshold"
                                                    type="number"
                                                    value={_.get(policy, 'threshold.cease_value')}
                                                    onChange={(e) => this.setPolicyProperty('threshold.cease_value', Number(e.currentTarget.value))}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.roleEditorColumn}>
                            <Condition />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="link" onClick={this.onClose}>{ls('NEW_ROLE_CANCEL', 'Отмена')}</Button>
                    <Button color="primary" onClick={this.onSubmit}>{ls('POLICIES_SUBMIT', 'Сохранить')}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default PolicyEditor;
