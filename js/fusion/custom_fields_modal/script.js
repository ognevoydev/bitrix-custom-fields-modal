BX.namespace('CustomFieldsModal')

/**
 * Class BX.CustomFieldsModal
 * @constructor
 */
// TODO - rewrite on class
// TODO - rewrite JQuery
// TODO - make setters
BX.CustomFieldsModal = function (popupId, params) {

    if (!params) {
        return;
    }

    if (!(typeof popupId === 'string' && popupId !== '')) {
        popupId = "custom-fields-modal-" + BX.util.getRandomString().toLowerCase();
    }

    this.id = popupId;
    this.fields = this.getFields(params.fields);
    this.categories = this.getCategories(params.fields);
    this.structure = this.getStructure(params.fields);
    this.content = this.getContent(this.structure);
    this.titleBar = this.getTitleBar(params.title);
    this.closeIcon = {right: "15px", top: "10px"};
    this.width = this.getParam(params.width);
    this.draggable = this.getParam(params.draggable);
    this.resizable = this.getParam(params.resizable);
    this.zIndex = 0;
    this.offsetLeft = 0;
    this.offsetTop = 0;
    this.buttons = this.getButtons(params.buttons);
    this.events = this.getEvents(params.events);
}

BX.CustomFieldsModal.prototype = {

    show: function () {
        let currentModal = BX(this.id);
        if (!currentModal) {
            this.render();
            this.popup = new BX.PopupWindow(
                this.id,
                null,
                {
                    content: this.content,
                    titleBar: {
                        content: this.titleBar,
                    },
                    closeIcon: this.closeIcon,
                    draggable: this.draggable,
                    resizable: this.resizable,
                    min_width: this.width,
                    zIndex: this.zIndex,
                    offsetLeft: this.offsetLeft,
                    offsetTop: this.offsetTop,
                    buttons: this.buttons,
                    events: this.events,
                });
            this.popup.show();
            this.addEventListeners();
        } else {
            currentModal.style.display = "block";
        }
    },

    getStructure: function (fields) {
        let structure = [];

        fields = fields instanceof Array ? fields : [fields];

        for (let field of fields) {
            if (field.fields) {
                field = this.getCategory(field);
            } else {
                field = this.getField(field);
            }
            if (field !== false) {
                structure.push(field);
            }
        }

        return structure;
    },

    getFields: function (fields) {
        let fieldList = [];

        for (let field of fields) {
            if (field.fields) {
                fieldList = [...fieldList, ...this.getFields(field.fields)];
            }
            field = this.getField(field);
            if (field !== false) {
                fieldList.push(field);
            }
        }

        return fieldList;
    },

    getField: function (fieldOptions) {

        let field = {};

        let fieldId = fieldOptions.id;
        let params = fieldOptions.params;
        let fields = fieldOptions.fields;

        if (!params) {
            return false;
        }

        if (typeof fields != "undefined") {
            return false;
        }

        if (!(typeof fieldId === 'string' && fieldId !== '')) {
            fieldId = "custom-field-" + BX.util.getRandomString().toLowerCase();
        }

        if (typeof fieldId != "undefined") {
            field.id = fieldId;
        }

        if (typeof params != "undefined") {
            field.params = params;
        }

        let labelNode = BX.create({
            tag: "div",
            props: {
                className: "custom-field-block-title",
            },
            children: [
                BX.create({
                    tag: "label",
                    props: {
                        className: params.required ? "required" : "",
                    },
                    text: params.label,
                }),
            ],
        });

        let fieldNode = '';

        switch (params.type) {
            case "text": {
                fieldNode = BX.create({
                    tag: "input",
                    props: {
                        id: fieldId,
                        className: "ui-ctl-element",
                    },
                    attrs: {
                        value: (params.default ?? ""),
                    },
                });
                break;
            }
            case "textarea": {
                fieldNode = BX.create({
                    tag: "div",
                    props: {
                        className: "ui-entity-editor-content-block",
                    },
                    children: [
                        BX.create({
                            tag: "textarea",
                            props: {
                                id: fieldId,
                                className: "ui-entity-editor-field-textarea",
                                cols: params.cols ?? 20,
                                rows: params.rows ?? 5,
                            },
                            text: (params.default ?? ""),
                        }),
                    ],
                });
                break;
            }
            case "date": {

                let defaultValue = (typeof params.default === 'string') ? params.default : '';

                fieldNode = BX.create({
                    tag: "div",
                    props: {
                        className: "ui-ctl ui-ctl-after-icon ui-ctl-datetime ui-ctl-w50",
                    },
                    children: [
                        BX.create({
                            tag: "div",
                            props: {
                                className: "ui-ctl-after ui-ctl-icon-calendar",
                            },
                        }),
                        BX.create({
                            tag: "input",
                            props: {
                                id: fieldId,
                                className: "ui-ctl-element "
                                    + (params.showTime ? "custom-field-datetime" : "custom-field-date"),
                            },
                            attrs: {
                                value: defaultValue,
                            },
                        }),
                    ],
                });
                break;
            }
            case "list": {

                let options = [];

                let items = (params.items instanceof Array) ? params.items : [];

                let defaultItems = params.default instanceof Array ? params.default : [params.default];

                for (let item of items) {
                    if (!item.value) {
                        continue;
                    }

                    options.push({
                        VALUE: item.value,
                        NAME: item.label,
                    });
                }
                options = JSON.stringify(options);

                let defaultOptions = [];
                let defaultNodes = [];

                for (let defaultItem of defaultItems) {
                    let default_value, default_name;

                    default_value = '' + params.default;
                    let item = items.find(el => el.value === default_value);

                    if (item) {
                        default_name = item.label;

                        let valueObj = {
                            VALUE: default_value,
                            NAME: default_name,
                        }

                        defaultOptions.push(valueObj)

                        defaultNodes.push(BX.create({
                            tag: "span",
                            props: {
                                className: "main-ui-square",
                            },
                            dataset: {
                                item: JSON.stringify(valueObj),
                            },
                            children: [
                                BX.create({
                                    tag: "span",
                                    props: {
                                        className: "main-ui-square-item",
                                    },
                                    text: valueObj.NAME,
                                }),
                                BX.create({
                                    tag: "span",
                                    props: {
                                        className: "main-ui-item-icon main-ui-square-delete",
                                    },
                                }),
                            ],
                        }),);
                    }
                }

                if (params.multiple === true) {
                    fieldNode = BX.create({
                        tag: "div",
                        props: {
                            id: fieldId,
                            className: "main-ui-control main-ui-multi-select custom-field-select",
                        },
                        dataset: {
                            items: options,
                            value: (defaultOptions) ? JSON.stringify(defaultOptions)
                                : "",
                            params: "{\"isMulti\":true}",
                        },
                        children: [
                            BX.create({
                                tag: "span",
                                props: {
                                    className: "main-ui-square-container",
                                },
                                children: defaultNodes ?? [],
                            }),
                            BX.create({
                                tag: "span",
                                props: {
                                    className: "main-ui-square-search",
                                },
                                children: [
                                    BX.create({
                                        tag: "input",
                                        props: {
                                            className: "main-ui-square-search-item",
                                        },
                                    }),
                                ],
                            }),
                            BX.create({
                                tag: "span",
                                props: {
                                    className: "main-ui-hide main-ui-control-value-delete",
                                },
                                children: [
                                    BX.create({
                                        tag: "span",
                                        props: {
                                            className: "main-ui-control-value-delete-item",
                                        },
                                    }),
                                ],
                            }),
                        ],
                    });
                } else {
                    fieldNode = BX.create({
                        tag: "div",
                        props: {
                            id: fieldId,
                            className: "main-ui-control main-ui-select custom-field-select",
                        },
                        dataset: {
                            items: options,
                            value: (defaultOptions[0]) ? JSON.stringify(defaultOptions[0])
                                : "",
                        },
                        children: [
                            BX.create({
                                tag: "span",
                                props: {
                                    className: "main-ui-select-name",
                                },
                                text: (defaultOptions[0]) ? defaultOptions[0].NAME
                                    : BX.message("SELECT_DEFAULT"),
                            }),
                            BX.create({
                                tag: "span",
                                props: {
                                    className: "main-ui-square-search",
                                },
                                children: [
                                    BX.create({
                                        tag: "input",
                                        props: {
                                            className: "main-ui-square-search-item",
                                        },
                                    }),
                                ],
                            }),
                        ],
                    });
                }

                break;
            }
            case "checkbox": {
                field.checked = params.checked;
                fieldNode = BX.create({
                    tag: "label",
                    props: {
                        className: "ui-ctl ui-ctl-xs ui-ctl-w100 ui-ctl-checkbox",
                    },
                    children: [
                        BX.create({
                            tag: "input",
                            props: {
                                id: fieldId,
                                className: "ui-ctl-element",
                                type: "checkbox",
                            },
                        }),
                        BX.create({
                            tag: "div",
                            props: {
                                className: "ui-ctl-label-text",
                            },
                            text: params.label,
                        })
                    ]
                });
                labelNode = '';
                break;
            }
            case "crm_entity": {
                fieldNode = BX.create({
                    tag: "div",
                    props: {
                        id: fieldId,
                    },
                });

                let selectedItems = [];
                if (params.default) {
                    let defaultItems = params.default instanceof Array ? params.default : [params.default];
                    for (let defaultItem of defaultItems) {
                        selectedItems.push({
                            id: defaultItem.value,
                            entityId: defaultItem.entityId ?? params.entity ?? "main",
                            title: defaultItem.title,
                        });
                    }
                }

                let dialogOptions = {
                    selectedItems: selectedItems,
                };

                if (params.entity) {
                    dialogOptions.entities = [
                        {
                            id: params.entity,
                        },
                    ];
                } else if (params.items) {

                    params.items.forEach((item) => {
                        if (!item.entityId) {
                            item.entityId = "main";
                        }
                        if (!item.selected) {
                            item.selected = false;
                        }
                    });

                    dialogOptions.items = params.items;
                    dialogOptions.dropdownMode = true;
                    dialogOptions.enableSearch = false;
                    dialogOptions.compactView = false;
                    dialogOptions.tabs = params.tabs;
                }

                field.tagSelector = new BX.UI.EntitySelector.TagSelector({
                    id: fieldId,
                    multiple: params.multiple,
                    dialogOptions: dialogOptions,
                });
                break;
            }
            // TODO - ajax get component
            case "file": {
                fieldNode = BX.create({
                    tag: "div",
                    props: {
                        id: fieldId,
                    },
                });

                BX.html(fieldNode, params.uploadForm);
                break;
            }
        }

        field.html = BX.create({
            tag: "div",
            props: {
                className: "custom-field-content-block",
            },
            children: [
                labelNode,
                BX.create({
                    tag: "div",
                    props: {
                        className: "custom-field-content-block",
                    },
                    children: [
                        fieldNode,
                    ],
                }),
            ],
        });

        return field;
    },

    getCategories: function (fields) {
        let categoryList = [];

        for (let field of fields) {
            if (field.fields) {
                field = this.getCategory(field);
                categoryList.push(field);
            }
        }

        return categoryList;
    },

    getCategory: function (fieldOptions) {

        let category = {};

        let label = fieldOptions.label;
        let fields = fieldOptions.fields;
        let params = fieldOptions.params ?? {};

        if (typeof label != 'string') {
            label = "";
        }

        category.fields = fields;

        let categoryNode = BX.create({
            tag: "div",
            props: {
                className: 'custom-field-category',
            },
        });

        let categoryIcon = BX.create({
            tag: "div",
            props: {
                className: 'custom-field-category-icon',
            },
        });

        let labelNode = BX.create({
            tag: "div",
            props: {
                className: "custom-field-category-title",
            },
            children: [
                BX.create({
                    tag: "label",
                    text: label,
                }),
                categoryIcon,
            ],
        });

        let fieldsNode = BX.create({
            tag: "div",
            props: {
                className: 'custom-field-category-fields',
            },
        });

        if (params.collapsed === true) {
            BX.addClass(categoryIcon, "custom-field-category-expand");
            BX.style(fieldsNode, "max-height", "0px");
        }

        categoryNode.appendChild(labelNode);

        if (fields instanceof Array) {
            for (let field of fields) {
                if (typeof field != 'object') {
                    continue;
                }

                if (field.fields) {
                    field = this.getCategory(field);
                } else {
                    field = this.getField(field);
                }

                if (typeof field.html !== 'undefined') {
                    fieldsNode.appendChild(field.html);
                }
            }

            categoryNode.appendChild(fieldsNode);

        }

        category.html = categoryNode;

        return category;
    },

    getContent: function (fields) {

        if (!(fields instanceof Array)) {
            return [];
        }

        let formNode = BX.create({
            tag: "div",
            props: {
                className: "custom-fields-form",
            },
        });

        for (let field of fields) {
            if (typeof field != 'object') {
                continue;
            }

            if (typeof field.html !== 'undefined') {
                formNode.appendChild(field.html);
            }
        }

        return formNode.outerHTML;
    },

    getTitleBar: function (title) {
        return BX.create({
            tag: "span",
            props: {
                className: 'access-title-bar'
            },
            children: [
                BX.create({
                    tag: "span",
                    props: {
                        className: 'ui-btn ui-btn-link custom-fields-modal-title',
                    },
                    text: (typeof title === 'string') ? title : '',
                }),
            ],
        })
    },

    getButtons: function (buttons) {

        if (!(buttons instanceof Array)) {
            return [];
        }

        let buttonList = [];

        for (let button of buttons) {

            if (typeof button != 'object') {
                continue;
            }

            buttonList.push(button);
        }

        return buttonList;
    },

    getEvents: function (events) {
        let result = {};

        if (events) {
            result = events;
        }

        let onPopupShow = result.onPopupShow;

        result.onPopupShow = () => {
            if (onPopupShow) {
                onPopupShow(this.popup);
            }

            this.render();
        };

        return result;
    },

    getParam: function (param) {
        if (typeof param == "undefined") {
            return false;
        }

        return param;
    },

    getResizable: function (resizable) {
        if (typeof resizable == "undefined") {
            return false;
        }

        return resizable;
    },

    addEventListeners: function () {

        let context = this.getContext();

        let content = context.getElementsByClassName("popup-window-content")[0];
        if (content) {
            content.style.backgroundColor = "transparent";
        }

        let form = context.getElementsByClassName("custom-fields-form")[0];

        // Плагин выбора даты
        let dateFields = form.querySelectorAll('.custom-field-date, .custom-field-datetime');
        for (let dateField of dateFields) {
            dateField.addEventListener('click', (e) => {
                BX.calendar({
                    node: e.target, field: e.target, bTime: e.target.classList.contains("custom-field-datetime"),
                    callback_after: (date) => {
                        this.setTime(e.target, date);
                    }
                });
            });
        }

        // Сворачивание и разворачивание категорий
        let collapseButtons = form.getElementsByClassName("custom-field-category-icon");
        for (let collapseButton of collapseButtons) {
            collapseButton.addEventListener('click', (e) => {
                let target = e.target;
                let fieldsList = target.parentNode.parentNode.lastChild;

                if (fieldsList.style.maxHeight !== "0px"){
                    fieldsList.style.maxHeight = 0 + "px";
                } else {
                    fieldsList.style.maxHeight = fieldsList.scrollHeight + "px";
                }

                target.classList.toggle("custom-field-category-expand");
            });
        }

        // Активация чекбоксов
        let checkboxFields = form.querySelectorAll('input[type=checkbox]');
        for (let checkboxField of checkboxFields) {

            let isChecked = this.fields.filter(field => {
                return field.id === checkboxField.id;
            })[0].checked;

            checkboxField.checked = isChecked == "1";
        }
    },

    setTime: function (node, date) {
        let yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let hh = date.getHours();
        let ii = date.getMinutes();
        let ss = date.getSeconds();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        if (hh < 10) hh = '0' + hh;
        if (ii < 10) ii = '0' + ii;
        if (ss < 10) ss = '0' + ss;

        let dateFormatted = dd + '.' + mm + '.' + yyyy + ' ' + hh + ":" + ii + ":" + ss;
        node.setAttribute("value", dateFormatted);
    },

    checkRequiredFields: function (fields = this.fields) {
        fields = fields.filter(function (field) {
            if (!field.params) {
                return false;
            }
            return field.params.required === true;
        });

        let fieldValues = this.getValues(fields);

        let fieldIds = Object.keys(fieldValues);

        let emptyFields = [];
        for (let nodeId of fieldIds) {
            if (fieldValues[nodeId].length === 0) {
                emptyFields.push(BX(nodeId).id);
            }
        }

        for (let nodeId of fieldIds) {
            let node = BX(nodeId);
            if (emptyFields.includes(nodeId)) {
                BX.addClass(node, "custom-field-empty");
            } else {
                BX.removeClass(node, "custom-field-empty");
            }
        }

        return emptyFields.length <= 0;
    },

    getValues: function (fields = this.fields) {
        let values = {};

        for (let field of fields) {
            if (!field.id) {
                continue;
            }
            values[field.id] = this.getValue(field);
        }

        return values;
    },

    getValue: function (field) {
        let value = "";

        let node = BX(field.id);

        if (!node) {
            return value;
        }

        let type = field.params.type;

        switch (type) {
            case "text":
            case "textarea": {
                value = node.value;
                break;
            }
            case "list": {
                let dataValue = node.getAttribute("data-value");

                if (field.params.multiple === true) {
                    if (dataValue.length > 0) {
                        value = [];
                        for (let dataObj of JSON.parse(dataValue)) {
                            value.push(dataObj.VALUE);
                        }
                    }
                } else {
                    if (dataValue.length > 0) {
                        value = JSON.parse(dataValue).VALUE;
                    }
                }
                break;
            }
            case "date": {
                value = node.getAttribute("value") ?? "";
                break;
            }
            case "checkbox": {
                value = node.checked ? "Y" : "N";
                break;
            }
            case "crm_entity": {
                let ids = [];
                let tagSelectors = this.fields.map(e => e.tagSelector).filter( e => {
                        return (typeof e !== "undefined" && e.id === field.id);
                    }
                );
                if (tagSelectors.length > 0) {
                    tagSelectors[0].getTags().forEach(function (e) {
                        ids.push(e.id);
                    });
                }
                value = (ids.length > 0) ? ids : "";
                break;
            }
            case "file": {
                value = [];

                let container = BX(field.id);

                if (!container) {
                    return;
                }

                let fileList = container.querySelectorAll("li");
                for (let fileItem of fileList) {
                    let fileIdNode = fileItem.querySelector("input[data-bx-role='file-id']");

                    if (fileIdNode) {
                        value.push(fileIdNode.getAttribute("value"));
                    }
                }

                if (value.length === 0) {
                    value = "";
                }

                if (value.length === 1) {
                    value = value[0];
                }
                break;
            }
        }

        return value;
    },

    renderToNode: function (node) {
        BX.html(node, this.content);
        this.addEventListeners();
        this.render();
    },

    render: function () {

        let tagSelectors = this.fields.map(e => e.tagSelector);

        if (tagSelectors) {
            for (let obj of tagSelectors) {

                if (typeof obj === "undefined") {
                    continue;
                }

                let context = this.getContext();

                let node = context.querySelector("#" + obj.id);
                if (node) {
                    obj.renderTo(node);
                    node.firstChild.id = node.id;
                    node.id = "";
                }
            }
        }

        for (let button of this.buttons) {
            button.context = this;
        }

        let doc = new DOMParser().parseFromString(this.content, "text/html");
        let categories = doc.querySelectorAll(".custom-field-category-title");

        for (let category of categories) {

            let parentCategory = category.closest(".custom-field-category-fields");
            if (!parentCategory) {
                continue;
            }

            let parentCategoryTitle = parentCategory.parentNode.querySelector(".custom-field-category-title");
            if (!parentCategoryTitle) {
                continue;
            }

            let parentPadding = window.getComputedStyle(parentCategoryTitle, null)
                .getPropertyValue('padding-left').slice(0, -2);

            category.style.paddingLeft = +parentPadding + 10 + "px";
        }
        this.content = doc.querySelector("body").innerHTML;
    },

    getContext: function () {
        let context = BX(this.id);
        if (!context) {
            context = document;
        }

        return context;
    }
}
