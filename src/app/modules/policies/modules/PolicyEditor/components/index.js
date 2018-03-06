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
            policy: props.policy,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMount === 'function') {
            this.props.onMount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.policy !== nextProps.policy) {
            this.setState({
                policy: nextProps.policy,
            });
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
    }

    onSubmit = () => {
        if (typeof this.props.onSubmit === 'function') {
            // this.props.onSubmit(this.props.userId, this.state.user);
            this.props.onSubmit(this.props.policyId, this.state.policy);
        }
    }

    render() {
        const { active, policyId } = this.props;
        const modalTitle = policyId
            ? ls('POLICIES_EDIT_POLICY_TITLE', 'Редактировать политику')
            : ls('POLICIES_CREATE_POLICY_TITLE', 'Создать политику');
        return (
            <Modal isOpen={active} size="lg">
                <ModalHeader toggle={this.onClose}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <div className={styles.roleEditorContent}>
                        <div className={styles.roleEditorColumn}>
                            <Configuration
                                getPolicyProperty={(key, defaultValue) => this.getPolicyProperty(key, defaultValue)}
                                setPolicyProperty={(key, value) => this.setPolicyProperty(key, value)}
                            />
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
                                                labelText={ls('POLICIES_ADD', 'Создать политику')}
                                                labelWidth="67%"
                                                inputWidth="33%"
                                            >
                                                <Input
                                                    id="cease_duration"
                                                    name="cease_duration"
                                                    value={this.getPolicyProperty('threshold.cease_duration')}
                                                    onChange={event => this.setPolicyProperty('threshold.cease_duration', _.get(event, 'target.value'))}
                                                />
                                            </Field>
                                        </div>
                                        <div style={{ width: '30%' }}>
                                            <Field
                                                id="cease_value"
                                                labelText={`${ls('POLICIES_POLICY_FIELD_CEASE_VALUE', 'Порог')}:`}
                                            >
                                                <Input
                                                    id="cease_value"
                                                    name="cease_value"
                                                    value={this.getPolicyProperty('threshold.cease_value')}
                                                    onChange={event => this.setPolicyProperty('threshold.cease_value', _.get(event, 'target.value'))}
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