const userId = getUserId()

let formInit

loadUserData(userId).then((response) => {
    formInit = response;
    $$('account').setValues(formInit);
    $$('notifications').setValues(formInit.notification_settings);
    $$('privacy').setValues(formInit.privacy_settings);
    $$('theme').elements['theme'].setValue(formInit.theme_settings.theme_id)
    $$('theme').elements['saveBtn'].disable()

}).catch((err) => {
    console.error("Error loading user data:", err);
});

webix.ui({
    container: 'app',
    view: 'layout',
    rows: [
        {
            view: 'toolbar',
            elements: [
                {view: 'label', label: 'User Preferences', align: 'center'}
            ]
        },
        {
            minHeight: 500,
            cols: [
                {
                    view: 'sidebar',
                    id: 'menu',
                    width: 200,
                    data: [
                        {id: 'account', value: 'Account Settings'},
                        {id: 'notifications', value: 'Notification Settings'},
                        {id: 'theme', value: 'Theme Settings'},
                        {id: 'privacy', value: 'Privacy Settings'}
                    ],
                    on: {
                        onAfterSelect: function (id) {
                            $$('mainView').setValue(id);
                        }
                    }
                },
                {
                    cells: [
                        {
                            id: 'account',
                            view: 'form',
                            elements: [
                                {
                                    view: 'text',
                                    label: 'Username',
                                    name: 'username',
                                    tooltip: 'Username must be unique<br>Has at least 4 characters<br>Has no spaces<br>Contain alphanumeric characters only',
                                    invalidMessage: '',
                                },
                                {
                                    view: 'text',
                                    label: 'Email',
                                    name: 'email',
                                    tooltip: 'Enter your email address',
                                    invalidMessage: 'The email you entered is not valid',
                                },
                                {
                                    view: 'text',
                                    type: 'password',
                                    label: 'Password',
                                    name: 'password',
                                    tooltip: 'Enter your password<br>Password must be at least 6 characters long'
                                },
                                {
                                    view: 'button',
                                    value: 'Save',
                                    css: 'webix_primary',
                                    name: 'saveBtn',
                                    disabled: true,
                                    click: function () {
                                        const formData = $$('account').getValues();
                                        onSaveAccount(formData, 'account')
                                    }
                                },
                            ],
                            rules: {
                                'email': webix.rules.isEmail,
                                'username': function (value) {
                                    if (value.length < 4) {
                                        $$('account').elements['username'].config.invalidMessage = "Username is too short";
                                        return false;
                                    }
                                    if (/\s/.test(value)) {
                                        $$('account').elements['username'].config.invalidMessage = "Username cannot contain spaces";
                                        return false;
                                    }
                                    $$('account').elements['username'].config.invalidMessage = "";
                                    return true;
                                },
                                'password': function (value) {
                                    if (value.length < 6) {
                                        $$('account').elements['password'].config.invalidMessage = "Password is too short";
                                        return false;
                                    }
                                    return true
                                }
                            },
                            on: {
                                'onChange': function () {
                                    const isValid = this.validate();
                                    if (isValid) {
                                        $$('account').elements['saveBtn'].enable()
                                    } else {
                                        $$('account').elements['saveBtn'].disable()
                                    }
                                }
                            }
                        },
                        {
                            id: 'notifications',
                            view: 'form',
                            elements: [
                                {
                                    view: 'switch',
                                    label: 'Email Notifications',
                                    labelWidth: 150,
                                    name: 'email_notifications'
                                },
                                {
                                    view: 'switch',
                                    label: 'Push Notifications',
                                    labelWidth: 150,
                                    name: 'push_notifications'
                                },
                                {
                                    view: 'slider',
                                    label: 'Frequency',
                                    name: 'frequency',
                                    value: 5,
                                    min: 1,
                                    max: 10,
                                    tooltip: function (value) {
                                        return ('You will get ' + value.value + ' notifications per day')
                                    }
                                },
                                {
                                    view: 'button',
                                    value: 'Save',
                                    name: 'saveBtn',
                                    css: 'webix_primary',
                                    disabled: true,
                                    click: function () {
                                        const formData = $$('notifications').getValues();
                                        onFormSave(formData, 'notifications')
                                    }
                                }
                            ],
                            on: {
                                'onChange': function () {
                                    $$('notifications').elements['saveBtn'].enable()
                                }
                            }
                        },
                        {
                            id: 'theme',
                            view: 'form',
                            elements: [
                                {
                                    view: 'select',
                                    label: 'Theme',
                                    name: 'theme',
                                    options: 'http://localhost:8000/api/themes/',
                                },
                                {
                                    view: 'select',
                                    label: 'Font',
                                    options: ['Arial', 'Verdana', 'Helvetica'],
                                    name: 'font'
                                },
                                {view: 'select', label: 'Layout', options: ['Compact', 'Spacious'], name: 'layout'},
                                {
                                    view: 'button',
                                    value: 'Save',
                                    css: 'webix_primary',
                                    name: 'saveBtn',
                                    disabled: true,
                                    click: function () {
                                        const formData = $$('theme').getValues();
                                        onFormSave(formData, 'theme')
                                    }
                                }
                            ],
                            on: {
                                'onChange': function () {
                                    $$('theme').elements['saveBtn'].enable()
                                }
                            }
                        },
                        {
                            id: 'privacy',
                            view: 'form',
                            elements: [
                                {
                                    view: 'switch',
                                    label: 'Profile Visibility',
                                    labelWidth: 150,
                                    name: 'profile_visibility'
                                },
                                {view: 'switch', label: 'Data Sharing', labelWidth: 150, name: 'data_sharing'},
                                {
                                    view: 'button',
                                    name: 'saveBtn',
                                    value: 'Save',
                                    css: 'webix_primary',
                                    disabled: true,
                                    click: function () {
                                        const formData = $$('privacy').getValues();
                                        onFormSave(formData, 'privacy')
                                    }
                                }
                            ],
                            on: {
                                'onChange': function () {
                                    $$('privacy').elements['saveBtn'].enable()
                                }
                            }
                        }
                    ],
                    id: 'mainView',
                    view: 'multiview',
                    animate: true,
                    value: 'account'
                }
            ]
        }
    ]
});

function onSaveAccount(data, form) {
    usernameAvailability(data.username).then((availability) => {
        if ($$('account').validate() && availability) {
            onFormSave(data, form);
        } else {
            webix.message('Username Already taken.');
        }
    });
}

function onFormSave(data, form) {
    onSave(data).then((result) => {
        if (result) {
            console.log(result)
            disableButton(form)
            webix.message('Update Successful');
            if (result.reload) {
                location.reload()
            }
        } else {
            webix.message("Failed to Update. Try again");
        }
    })
}

function disableButton(form) {
    $$(form).elements['saveBtn'].disable()
}

async function onSave(data) {
    const url = `/api/user-data/update/`;
    const requestData = {id: userId, ...data};
    try {
        const response = await webix.ajax()
            .headers({'Content-Type': 'application/json'})
            .post(url, requestData);
        const data = response.json();
        return data
    } catch (err) {
        console.log(err);
        return null;
    }
}


function getUserId() {
    return 1
}

async function loadUserData(userId) {
    const url = `/api/user-data/${userId}`;
    try {
        const response = await webix.ajax().get(url);
        return await response.json();
    } catch (err) {
        webix.message("Failed to load user data");
        console.error(err);
        throw err;
    }
}

async function usernameAvailability(username) {
    if (username === formInit.username) {
        return true;
    }
    const url = `/api/user-data/username/`;
    const requestData = {username: username};

    try {
        const response = await webix.ajax()
            .headers({'Content-Type': 'application/json'})
            .post(url, requestData);
        const data = response.json();
        return !!data.availability;
    } catch (err) {
        webix.message("Failed to check server");
        console.log(err);
        return false;
    }
}