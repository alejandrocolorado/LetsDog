class Signup{
    constructor(){

        this.emailInput = document.getElementById('signupEmailInput');
        this.passwordInput = document.getElementById('signupPasswordInput');
        this.repeatPasswordInput = document.getElementById('signupPasswordRepeatInput');

        this.photoDogAvatarPreview = document.getElementById('photoDogAvatar');
        this.photoDogUrl = '';
        this.photoDogInputFile = document.getElementById('photoDogInputFile');
        this.photoDogSubmit = document.getElementById('photoDogSubmit');
        this.photoDogForm = document.getElementById('photoDogForm');

        this.dogNameInput = document.getElementById('signupDogName');
        this.dogSexInput = document.querySelector('input[name="signupDogSex"]:checked');
        this.dogBreedInput = document.getElementById('signupDogBreed');
        this.dogAgeInput = document.getElementById('signupDogAge');
        this.dogSizeInput = document.getElementById('signupDogAge');
        this.dogBehaviorPeopleInput = document.getElementById('signupDogBehaviorPeople');
        this.dogBehaviorDogsInput = document.getElementById('signupDogBehaviorDogs');

        this.signupBtnStep1 = document.getElementById('btnValidateEmail');
        this.signupBtnContinue = document.getElementById('btnContinueSignup');

        this.userData = {
            email: '',
            password: ''
        }

        this.dogData = {
            photo: '',
            name: '',
            age: 0,
            sex: '',
            breed: '',
            size: '',
            behavior: {
                withDogs: '',
                withPeople: ''
            }
        }

        this.clientData = {
            //userId: "",
            //dogId: "",
            favourites: [],
            cards: [],
            coords: {
              type: "Point",
              coodinates: [0, 0],
            },
        }
    }

    handleIfEmailExists = async (e) => {
        e.preventDefault();
        axios.post('/manage/validate-user', { email: this.emailInput.value })
            .then((response) => {
                if (!response.data) {
                    validator.UserErrorForms.errorEmailMsg = validator.emailExistError;
                    validator.checkValidationMsg(e, validator.emailExistError)
                } else {
                    splide.go( '+1' );
                }
            })
            .catch( err => console.log(err));
    }

    handleEmail = (e) => {
        const email = e.target.value;

        // validamos con validator
        validator.validateEmail(e, email);

        this.checkSubmitButton(this.signupBtnStep1, 'UserErrorFormsStep1');
    }

    handlePassword = (e) => {
        const password = e.target.value;
        // Validamos campo
        validator.validatePassWord(e, password);
        this.checkSubmitButton(this.signupBtnStep1, 'UserErrorFormsStep1');
    }

    handleRepeatPassword = (e) => {
        const repeatPassword = e.target.value;
        const password = this.passwordInput.value;
        // Validamos campo
        validator.validateRepeatPassword(e, password, repeatPassword);
        this.checkSubmitButton(this.signupBtnStep1, 'UserErrorFormsStep1');
    }

    handleDogName = (e) => {
        const name = e.target.value;
        validator.validateDogName(e, name);
        this.checkSubmitButton(this.signupBtnContinue, 'UserErrorFormsStep2');
    }

    sendAvatarPhoto = (e) => {
        e.preventDefault();
        this.updatePhoto(
            this.photoDogInputFile, this.photoDogAvatarPreview, '/manage/validate-photo', 'photo'
        )
    }

    updatePhoto = (inputFile, wrapperPreview, postUrl, objKeyName) => {
        const photoToUpload = inputFile.files[0];
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const data = new FormData()
        data.append('image', photoToUpload);

        axios.post(postUrl, data, config)
            .then((response) => {
                this.dogData[objKeyName] = response.data;
                wrapperPreview.style.backgroundImage = `url(${this.dogData[objKeyName]})`;
                wrapperPreview.classList.add('cover')
            })
            .catch(err => {
                console.error("Image post failed: ", err)
            })
    }

    addUserData = () => {
        this.userData.email = this.emailInput.value;
        this.userData.password = this.passwordInput.value;
    }

    addDogData = () => {
        this.dogData.photo = this.photoDogUrl;
        this.dogData.name = this.dogNameInput.value;
        this.dogData.sex = this.dogSexInput.value;
        this.dogData.breed = this.dogBreedInput.value;
        this.dogData.age = Number(this.dogAgeInput.value);
        this.dogData.size = this.dogSizeInput.value;
        this.dogData.behavior.withPeople = this.dogBehaviorPeopleInput.value;
        this.dogData.behavior.withDogs = this.dogBehaviorDogsInput.value;

        console.log('sex: ', this.dogSexInput.value)
    }

    sendSignupFormData = (e) => {
        
        e.preventDefault();
        this.addUserData();
        this.addDogData();
        
        const signupData = {
            userData: {
                ...this.userData
            },
            dogData: {
                ...this.dogData
            },
            clientData: {
                ...this.clientData
            }
        };

        console.log
        console.log(signupData)

        axios.post('/signup', signupData)
            .then( () => {
                window.location.href = '/service'
            })
            .catch( err => console.log(err));

    }

    checkSubmitButton = (button, errors) => {

        console.log('validano...')
        const pendentErrors = Object.keys(validator[errors]);

        console.log(pendentErrors)

        if(pendentErrors.length !== 0){
            button.disabled = true;
            if(splide.index === 0){
                
            }
        } else {
            button.disabled = false;
        }
    }

    addListeners = () => {

        this.emailInput.addEventListener('input', this.handleEmail)
        this.passwordInput.addEventListener('input', this.handlePassword)
        this.repeatPasswordInput.addEventListener('input', this.handleRepeatPassword)
        this.dogNameInput .addEventListener('input', this.handleDogName)

        this.photoDogAvatarPreview.addEventListener('click', () => {
            this.photoDogInputFile.click()
        })
        this.photoDogForm.addEventListener('submit', this.sendAvatarPhoto);
        this.photoDogInputFile.addEventListener('change', () => {
            this.photoDogSubmit.click()
        });
        
        this.signupBtnStep1.addEventListener('click', this.handleIfEmailExists);
        this.signupBtnContinue.addEventListener('click', this.sendSignupFormData);
    }

    init = () => {
        this.addListeners();
    }

}

const signup = new Signup();
window.addEventListener('load', signup.init())