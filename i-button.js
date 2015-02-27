module.exports = function (window) {
    "use strict";

    require('itags.core')(window);
    require('./css/i-button.css');

    var itagName = 'i-button', // <-- define your own itag-name here
        ITSA = window.ITSA,
        Event = ITSA.Event,
        Itag, IFormElement;

    if (!window.ITAGS[itagName]) {
        IFormElement = require('i-formelement')(window);

        Event.before(itagName+':manualfocus', function(e) {
            // the i-select itself is unfocussable, but its button is
            // we need to patch `manualfocus`,
            // which is emitted on node.focus()
            // a focus by userinteraction will always appear on the button itself
            // so we don't bother that
            var element = e.target;
            e.preventDefault();
            element.itagReady().then(
                function() {
                    var button = element.getElement('button');
                    button && button.focus(true, true);
                }
            );
        });
        Event.after('tap', function(e) {
            var element = e.target.getParent(),
                model = element.model;
            if (!model.disabled) {
                /**
                * Emitted when a the i-select changes its value
                *
                * @event i-button:tap
                * @param e {Object} eventobject including:
                * @param e.target {HtmlElement} the i-select element
                * @param e.buttonType {String} the type of the button, equals model.type
                * @since 0.1
                */
                element.emit('tap', {
                    buttonType: model.type
                });
            }
        }, 'i-button > button');

        Itag = IFormElement.subClass(itagName, {
            /*
             *
             * @property attrs
             * @type Object
             * @since 0.0.1
            */
            attrs: {
                disabled: 'boolean',
                type: 'string'
            },
            init: function() {
                var element = this,
                    designNode = element.getItagContainer(),
                    buttonText = designNode.getHTML();

                // when initializing: make sure NOT to overrule model-properties that already
                // might have been defined when modeldata was boundend. Therefore, use `defineWhenUndefined`

                element.defineWhenUndefined('text', (buttonText==='') ? '&nbsp;' : buttonText); // sets element.model.someprop = somevalue; when not defined yet
            },

            render: function() {
                this.setHTML('<button></button>');
            },

            sync: function() {
                var element = this,
                    button = element.getElement('button');
                button.setHTML(element.model.text);
            },

            destroy: function() {
            }
        });

        window.ITAGS[itagName] = Itag;
    }

    return window.ITAGS[itagName];
};
