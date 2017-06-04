import config from 'polythene/config/config';
import mixin from 'polythene/common/mixin';

const styles = [{
    '.demo-list': {
        '&.checkbox-secondary-list': {
            ' .checkbox': {
                color: '#e91e63'
            },
            ' .pe-list-tile__title': [
                mixin.vendorize({
                    'user-select': 'none'
                }, config.prefixes_user_select)
            ]
        }
    }
}];

export default styles;
