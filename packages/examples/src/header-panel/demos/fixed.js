import 'polythene/common/object.assign';
import m from 'mithril';
import { HeaderPanel } from 'polythene';
import common from './common';

const TITLE = 'Fixed header';
const SUBTITLE = '';
const PANEL_PROPS = {
    class: 'pe-header-panel--fit',
    fixed: true
};

const module = {};
module.view = function() {
    return m('.demo-header-panel',
        m(HeaderPanel, Object.assign({}, {
            header: {
                toolbar: {
                    topBar: common.toolbarRow(''),
                    bottomBar: common.createBottomBar(TITLE, SUBTITLE)
                }
            },
            content: m.trust(common.textContent())
        }, PANEL_PROPS))
    );
};

module.hideNav = true;

export default module;
