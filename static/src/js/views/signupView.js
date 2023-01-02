import View from './View.js';
import { updateURL } from '../helper.js'

class SignUpView extends View {
  _parentElem = document.querySelector('main');

  _generateMarkup() {
    return `
    <section class="form__section">
      <div class="form__section__logo--lg">
        <img class="form__section__img" loading='lazy' src="/static/src/images/m_logo.jpg" alt="Slack (website logo)">
      </div>

      <div class="form__container form__container--blur">

        <h2 class="form__container__heading login__heading">Create Account</h2>

        <form class="signup__form">
        
        <div class="signup__form__profile">
          <div class="signup__form__profile__fake">
          <img src="static/src/images/avatar.png"/>
          </div>
          <label for="profile">Choose a profile pic</label>
          <input accept="image/png image/jpg image/jpeg" id="profile" type="file" name="profile">
        </div>
        
          <label for="Fn">Full Name</label>
          <input class="input__label__input" id="Fn" required type="text" name="fullname" placeholder="Full name">

          <label for="email">Email</label>
          <input class="input__label__input" placeholder="Email" required type="email" id="email" name='email' />

          <label for="password">Password</label>
          <input class="input__label__input" placeholder="Password@0" required pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$' title='Password should contain a number, a capital letter, a small letter and a symbol' type="text" name="password" id="password">

          <label for="Repassword">Retype Password (re-type your password)</label>
          <input class="input__label__input" placeholder="Password@0" required pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$' title='Password should contain a number, a capital letter, a small letter and a symbol' type="text" name="Repassword" id="Repassword">
          
          <label for="phone">Phone Number</label>
          <div class="signup__form__phone-input">
          <input type='tel' size='3' maxlength='3' name='countryCode' placeholder='+91'>
            <input class="input__label__input" placeholder="99999-99999" type="tel" pattern="[0-9]{5}-[0-9]{5}" size='11' maxlength='11' id="phone" name='phone' />
          </div>

          <label for="dob">DOB</label>
          <input name="dob" required id="dob" type="date" value="">

          <label for="state">State</label>
          <input class="input__label__input" placeholder="state you're currently living in" required id="state"name="state" type="text" value="">

          <label for="country">Country</label>
          <input class="input__label__input" placeholder="country you're currently living in" required id="country" type="text" name="country">


          <section class="section__error">
            <p class="section__error__msg"></p>
          </section>

          <button class="form__btn signup-btn" type="submit">Sign up</button>

          <p class="signup--login">Already have a account?<a href="/">Log In</a></p>
        </form>
      </div>
    </section>`
  }

  getSignInDetails(router, createUserSendEmailVerif, createUserData) {
    const form = document.querySelector('form');
    form.addEventListener('submit', async e => {
      try {
        e.preventDefault();
        const fd = new FormData(form);
        const userInfoObj = Object.fromEntries(fd);
        const isSame = this.#isPasswordsSame(userInfoObj);
        const isInputsCorrect = this.isInputsCorrect(userInfoObj);

        if (!isSame) throw Error('Passwords do not match');

        if (!isInputsCorrect) throw Error('Please enter full name');

        const user = await createUserSendEmailVerif(userInfoObj.email, userInfoObj.password);

        //create important properties on user obj of firebase
        user.displayName = userInfoObj.fullname;
        user.photoURL = userInfoObj.profile.name;
        user.email = userInfoObj.email;
        user.phoneNumber = userInfoObj.countryCode + userInfoObj.phone;
        //create user data on firebase database
        createUserData(user);
        updateURL('/')
        router();
      } catch (err) {
        this.renderError(err, 'login');
      }
    })
  }

  isInputsCorrect(userInfoObj) {
    let { fullname } = userInfoObj;
    fullname = fullname.includes(' ');
    return fullname
  }

  #isPasswordsSame(userInfoObj) {
    let { password, Repassword: rePassword } = userInfoObj;
    password = password.split('');
    rePassword = rePassword.split('');
    const isSame = password.every((l, i) => rePassword[i] === l);
    return isSame
  }
}

export default new SignUpView()