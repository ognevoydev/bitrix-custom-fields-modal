function showModal1() {
    new BX.CustomFieldsModal(
        "modal_example_1",
        {
            title: "Заполните поля",
            fields: [
                {
                    id: "f_TEXT",
                    params: {
                        type: "text",
                        label: "Текст",
                        default: "",
                    },
                },
                {
                    id: "f_TEXTAREA",
                    params: {
                        type: "textarea",
                        label: "Текстовое поле",
                        default: "",
                    },
                },
                {
                    id: "f_DATE",
                    params: {
                        type: "date",
                        label: "Дата",
                        default: "",
                        showTime: true,
                    },
                },
                {
                    id: "f_LIST",
                    params: {
                        type: "list",
                        label: "Список",
                        default: "2",
                        items: [
                            {
                                value: "1",
                                label: "Элемент 1",
                            },
                            {
                                value: "2",
                                label: "Элемент 2",
                            },
                            {
                                value: "3",
                                label: "Элемент 3",
                            },
                        ],
                    },
                },
                {
                    id: "f_CHECKBOX",
                    params: {
                        type: "checkbox",
                        label: "Флажок",
                        checked: true,
                    },
                },
                {
                    id: "f_USER",
                    params: {
                        type: "crm_entity",
                        label: "Пользователь",
                        entity: "user",
                        multiple: false,
                        default: [
                            {
                                value: 1,
                                title: "Admin Admin",
                            },
                        ],
                    },
                },
            ],
            buttons: [
                new BX.UI.Button({
                    color: BX.UI.Button.Color.SUCCESS,
                    text: 'Продолжить',
                    onclick: (button, event) => {
                        console.log(button.context.getValues());
                    }
                }),
                new BX.UI.Button({
                    color: BX.UI.Button.Color.LINK,
                    text: 'Закрыть',
                    onclick: (button, event) => {
                        button.context.popup.close()
                    }
                })
            ],
            events:
                {
                    onPopupClose: function (e) {
                        e.destroy();
                    }
                },
            resizable: true,
            draggable: true,
        }
    ).show();
}

function showModal2() {
    new BX.CustomFieldsModal(
        "modal_example_2",
        {
            title: "Заполните поля",
            fields: [
                {
                    label: "Категория 1",
                    fields: [
                        {
                            id: "f_TEXT",
                            params: {
                                type: "text",
                                label: "Текст",
                                default: "",
                                required: true,
                            },
                        },
                        {
                            id: "f_TEXTAREA",
                            params: {
                                type: "textarea",
                                label: "Текстовое поле",
                                default: "",
                            },
                        },
                        {
                            id: "f_DATE",
                            params: {
                                type: "date",
                                label: "Дата",
                                default: "",
                                showTime: true,
                            },
                        },
                    ],
                },
                {
                    label: "Категория 2",
                    fields:[
                        {
                            id: "f_CHECKBOX",
                            params: {
                                type: "checkbox",
                                label: "Флажок",
                                checked: true,
                            },
                        },
                    ],
                    params: {
                        collapsed: true,
                    },
                },
            ],
            buttons: [
                new BX.UI.Button({
                    color: BX.UI.Button.Color.SUCCESS,
                    text: 'Продолжить',
                    onclick: (button, event) => {
                        if (button.context.checkRequiredFields()) {
                            console.log(button.context.getValues());
                        } else {
                            this.alert('Не заполнены обязательные поля.');
                        }
                    }
                }),
                new BX.UI.Button({
                    color: BX.UI.Button.Color.LINK,
                    text: 'Закрыть',
                    onclick: (button, event) => {
                        button.context.popup.close()
                    }
                })
            ],
            events:
                {
                    onPopupClose: function (e) {
                        e.destroy();
                    }
                },
            resizable: true,
            draggable: true,
        }
    ).show();
}

function showModal3() {
    new BX.CustomFieldsModal(
        "modal_example_3",
        {
            title: "Заполните поля",
            fields: [
                {
                    label: "Категория 1",
                    fields: [
                        {
                            label: "Подкатегория 1",
                            fields: [
                                {
                                    label: "Подкатегория 2",
                                    fields: [
                                        {
                                            id: "f_TEXT",
                                            params: {
                                                type: "text",
                                                label: "Текст",
                                                default: "",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            buttons: [
                new BX.UI.Button({
                    color: BX.UI.Button.Color.SUCCESS,
                    text: 'Продолжить',
                    onclick: (button, event) => {
                        console.log(button.context.getValues());
                    }
                }),
                new BX.UI.Button({
                    color: BX.UI.Button.Color.LINK,
                    text: 'Закрыть',
                    onclick: (button, event) => {
                        button.context.popup.close()
                    }
                })
            ],
            events:
                {
                    onPopupClose: function (e) {
                        e.destroy();
                    }
                },
            resizable: true,
            draggable: true,
        }
    ).show();
}

function showModal4() {
    new BX.CustomFieldsModal(
        "modal_example_4",
        {
            title: "Заполните поля",
            fields: [
                {
                    id: "f_USER",
                    params: {
                        type: "crm_entity",
                        label: "Пользователь",
                        entity: "user",
                        multiple: false,
                        default: [
                            {
                                value: 1,
                                title: "Admin Admin",
                            },
                        ],
                    },
                },
                {
                    id: "f_CUSTOM_USER",
                    params: {
                        type: "crm_entity",
                        label: "Свой пользователь",
                        items: [
                            {
                                id: 1,
                                entityId: "user",
                                title: "Пользователь 1",
                                tabs: "base",
                                selected: true,
                            },
                            {
                                id: 2,
                                entityId: "user",
                                title: "Пользователь 2",
                                tabs: "base",
                                selected: false,
                            },
                        ],
                        tabs: [{id: 'base', title: 'Пользователи', itemOrder: {title: 'asc'}}],
                        multiple: false,
                    },
                },
                {
                    id: "f_CRM_ENTITY",
                    params: {
                        type: "crm_entity",
                        label: "Своя сущность",
                        multiple: true,
                        default: [
                            {
                                value: 1,
                                title: "Элемент 1",
                            },
                            {
                                value: 2,
                                title: "Элемент 2",
                            },
                        ],
                        items: [
                            {
                                id: 1,
                                title: "Элемент 1",
                                tabs: "base",
                            },
                            {
                                id: 2,
                                title: "Элемент 2",
                                tabs: "base",
                            }
                        ],
                        tabs: [{id: 'base', title: 'Сущности', itemOrder: {title: 'asc'}}],
                    },
                },
                {
                    id: "f_LIST",
                    params: {
                        type: "list",
                        label: "Список",
                        default: "2",
                        items: [
                            {
                                value: "1",
                                label: "Элемент 1",
                            },
                            {
                                value: "2",
                                label: "Элемент 2",
                            },
                            {
                                value: "3",
                                label: "Элемент 3",
                            },
                        ],
                    },
                },
                {
                    id: "f_MULTI_LIST",
                    params: {
                        type: "list",
                        label: "Множественный список",
                        default: "2",
                        items: [
                            {
                                value: "1",
                                label: "Элемент 1",
                            },
                            {
                                value: "2",
                                label: "Элемент 2",
                            },
                            {
                                value: "3",
                                label: "Элемент 3",
                            },
                        ],
                        multiple: true,
                    },
                },
            ],
            buttons: [
                new BX.UI.Button({
                    color: BX.UI.Button.Color.SUCCESS,
                    text: 'Продолжить',
                    onclick: (button, event) => {
                        console.log(button.context.getValues());
                    }
                }),
                new BX.UI.Button({
                    color: BX.UI.Button.Color.LINK,
                    text: 'Закрыть',
                    onclick: (button, event) => {
                        button.context.popup.close()
                    }
                })
            ],
            events:
                {
                    onPopupClose: function (e) {
                        e.destroy();
                    }
                },
            resizable: true,
            draggable: true,
        }
    ).show();
}
