import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.scss';

class KQI extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        type: PropTypes.oneOf(['KAB', 'KGS', 'KSPD']).isRequired,
        value: PropTypes.number,
        positive: PropTypes.bool,
        negative: PropTypes.bool,
        precision: PropTypes.number,
        placeholder: PropTypes.string,
    };
    static defaultProps = {
        precision: 2,
        placeholder: 'N/A',
    };

    static parseType(type) {
        if (type === 'KAB') return ['К', 'аб'];
        if (type === 'KGS') return ['К', 'гс'];
        if (type === 'KSPD') return ['К', 'спд'];
        return ['?', '?'];
    };

    render() {
        const {
            className,
            type,
            value,
            positive,
            negative,
            precision,
            placeholder,
        } = this.props;

        const [parameter, index] = KQI.parseType(type);

        return (
            <p className={cn(styles.KQI, className, {
                [styles.positive]: positive,
                [styles.negative]: negative,
            })}>
                <span className={styles.name}>
                    <span className={styles.parameter}>{parameter}</span>
                    <span className={styles.index}>{index}</span>
                </span>
                {typeof value === 'number' ? (
                    <span className={styles.value}>
                        <span className={styles.raw}>{value.toFixed(precision)}</span>
                        <span className={styles.units}>%</span>
                    </span>
                ) : (
                    <span className={styles.value}>{placeholder}</span>
                )}
            </p>
        );
    }
}

export default KQI;