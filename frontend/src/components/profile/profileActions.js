import Action, { updateSuccess, updateError, resource } from '../../actions'

export function validateProfile({username, email, phone, zipcode, password, pwconf}) {
    if (username) {
        if (!username.match('^[a-zA-Z][a-zA-Z0-9]*')) {
            return 'Invalid username. Only upper case and lower case letters and numbers; Starts with a letter'
        }
    }

    if (email) {
        if (!email.match('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z][a-zA-Z]+$')) {
            return 'Invalid email.  Must be like a@b.edu/a@b.co'
        }
    }

    if (phone) {
        if (!phone.match('^([0-9]{3})+\-+([0-9]{3})+\-+([0-9]{4})$')) {
            return 'Invalid phone. Should be ###-###-####'
        }
    }

    if (zipcode) {
        if (!zipcode.match('^([0-9]{5})$')) {
            return 'Invalid zipcode. Should be #####'
        }
    }

    if (password || pwconf) {
        if (password !== pwconf) {
            return 'Password do not match'
        }
        // enforce strong passwords!
    }

    return ''
}

export function updateHeadline(headline) {
    return (dispatch) => {
        dispatch(updateField('headline', headline))
    }
}

export function updateProfile({email, zipcode, password, pwconf}) {
    return (dispatch) => {
        const err = validateProfile({email, zipcode, password, pwconf})
        if (err.length > 0) {
            return dispatch(updateError(err))
        }
        dispatch(updateField('email', email))
        dispatch(updateField('zipcode', zipcode))
        dispatch(updateField('password', password))
    }
}

export function fetchProfile() {
    return (dispatch) => {
        dispatch(fetchField('avatars'))
        dispatch(fetchField('zipcode'))
        dispatch(fetchField('email'))
        dispatch(fetchField('dob'))
    }
}

function updateField(field, value) {
    return (dispatch) => {
        if (value) {
            const payload = {}
            payload[field] = value
            resource('PUT', field, payload).then((response) => {
                const action = { type: Action.UPDATE_PROFILE }                
                action[field] = response[field]
                if (field == 'password')
                    dispatch(updateError('password will not be changed'))
                else
                    dispatch(action)
            })
        }
    }
}



function fetchField(field) {
    return (dispatch) => {
        resource('GET', field).then((response) => {
            const action = { type: Action.UPDATE_PROFILE }
            switch(field) {
                case 'avatars':
                    action.avatar = response.avatars[0].avatar; break;
                case 'email':
                    action.email = response.email; break;
                case 'zipcode':
                    action.zipcode = response.zipcode; break;
                case 'dob':
                    action.dob = new Date(response.dob).toDateString(); break;
            }
            dispatch(action)
        })
    }
}

export function uploadImage(file) {
    return (dispatch) => {
        if (file) {
            const fd = new FormData()
            fd.append('image', file)
            resource('PUT', 'avatar', fd, false)
            .then((response) => {
                dispatch({ type: Action.UPDATE_PROFILE, avatar: response.avatar })
            })
        }
    }
}

export function connectFB({originalUserName, originalPassword}) {
    //connect the facebook account with a normal account
    return (dispatch) => {
        if(originalUserName && originalPassword){
            resource('POST', 'FB_connect', {originalUserName, originalPassword})
            .then((response) => {
                dispatch(updateSuccess(`Your facebook account is now linked with ${originalUserName}`))
            }).catch((err) => {
                dispatch(updateError(`Error happens when linking your facebook account with ${originalUserName}`))
            })
        }
    }
}

export function disconnectFB() {
    //disconnect facebook account and normal account
    return (dispatch) => {
        resource('GET', 'FB_disconnect').then((response) => {
            dispatch(updateSuccess('Successfully disconnect normal account and facebook account'))
        }).catch((err) => {
            console.log(err)
            dispatch(updateError('Error happens when disconnecting normal account and facebook account'))
        })
    }
}

export function oriToFBlink() {
    return (dispatch) => {
        window.top.location = 'https://mighty-reef-86521.herokuapp.com/link/facebook'
        dispatch(navToProfile())
    }
}
