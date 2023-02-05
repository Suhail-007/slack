import View from '../View.js'
import reAuthUser from '../components/reAuthUser.js'
import { chartTypes, defaultUserPic } from '../../config.js';
import { updateURL } from '../../helper.js'

class ProfileView extends View {
  _parentElem = document.querySelector('main');
  _settingsElem;
  _reAuthUserEmailPass;
  _edit = false;

  _generateMarkup() {
    const {personalInfo, extraInfo} = this._data.data;
    return `
      <section class="section section__profile">
        <div class="section__heading tab-heading u-letter-spacing-sm">
          <h2>Profile</h2>
        </div>
    
        <div class="profile__cont">
          <figure class="profile__cont-photo">
            <img class='dp' loading="lazy" src="${this.#setUserPic(extraInfo)}" alt="user profile">
          </figure>
          <div class='profile__bio'>
            <p class="profile__user-name">${personalInfo.fullname}</p>
            <p class="profile__bio">${extraInfo.bio}</p>
          </div>
        </div>
    
        <div class="profile__info">
          <h3 class="tab-heading u-letter-spacing-sm">User Info</h3>
          ${this.userInfo(personalInfo)}
        </div>
    
        <hr>
    
        <div data-settings class="section__settings">
          <h3 class="tab-heading u-letter-spacing-sm">Settings</h3>
            
          <div>
            <h4>Theme Mode</h4>
            <div class='u-LineBar'>
              <label for="theme">Theme</label>
              <select data-select='theme' name="theme" id="theme">
                <option ${this.#isSelectedValue('system default')} value="system default">system default</option>
                <option ${this.#isSelectedValue('light')} value="light">light</option>
                <option ${this.#isSelectedValue('dark')} value="dark">dark</option>
              </select>
            </div>
          </div>
    
          <div>
            <h4 class="u-letter-spacing-sm">Chart Settings</h4>
            <div class='u-LineBar'>
              <label for="chartOne">Chart 1</label>
              <select data-select='chartOne' name="chartOne" id="chartOne">
                <option ${this.#isSelectedValue('doughtnut', 'chartOne')} value="doughnut">Doughnut</option>
                <option ${this.#isSelectedValue('line', 'chartOne')} value="line">Line</option>
                <option ${this.#isSelectedValue('bar', 'chartOne')} value="bar">Bar</option>
                <option ${this.#isSelectedValue('pie', 'chartOne')} value="pie">Pie</option>
              </select>
            </div>
              
            <div class='u-LineBar'>
              <label for="chartTwo">Chart 2</label>
              <select data-select='chartTwo' name="chartTwo" id="chartTwo">
                <option ${this.#isSelectedValue('line', 'chartTwo')} value="line">Line</option>
                <option ${this.#isSelectedValue('bar', 'chartTwo')} value="bar">Bar</option>
                <option ${this.#isSelectedValue('pie', 'chartTwo')} value="pie">Pie</option>
                <option ${this.#isSelectedValue('doughnut', 'chartTwo')} value="doughnut">Doughnut</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="message-cont">
          <p class="message"></p>
        </div>
        
        <div data-btns-cont class='section__profile__buttons'>
          <button type='button' data-cta='edit' class='btn btn-edit section__profile__buttons--edit'>Edit Profile</button>
          <button type='button' data-cta='delete' class='btn btn-delete section__profile__buttons--delete'>Delete Profile</button>
        </div>
        
        <!------ReAuthForm---->
        ${reAuthUser.renderData(false)}
      </section>
      `
  }

  userInfo(user) {
    const arr = [];
    for (let key in user) {
      if (key === 'fullname') continue
      arr.push(this.Bar(key, user[key]));
    }
    return arr.sort().join('');
  }

  Bar(catNam, category) {
    return `
      <div class='u-LineBar'>
        <p>${catNam}</p>
        <p>${category}</p>
      </div>
    `
  }

  init(settings, deleteUserAndData, loginUser, renderTab) {
    this.setTitle('Profile || Slack');
    this.#addHandlerSettings(settings);
    this.#callToActionBtns(deleteUserAndData, loginUser, renderTab);
  }

  #addHandlerSettings(settings) {
    this._settingsElem = document.querySelector('[data-settings]');
    this._settingsElem.addEventListener('click', settings);
  }

  #isSelectedValue(value, selectOption = 'theme') {
    value = value.toLowerCase();

    if (selectOption === 'theme') {
      const selectedTheme = this._data.themeMode;
      if (selectedTheme === value) return 'selected';
    }

    if (selectOption === 'chartOne') {
      const selectedTheme = chartTypes.chartOne;
      if (selectedTheme === value) return 'selected';
    }

    if (selectOption === 'chartTwo') {
      const selectedTheme = chartTypes.chartTwo;
      if (selectedTheme === value) return 'selected'
    }
  }

  #callToActionBtns(deleteUserAndData, loginUser, renderTab) {
    const btnsCont = document.querySelector('[data-btns-cont]');

    btnsCont.addEventListener('click', async e => {
      try {
        const btn = e.target.dataset.cta;
        if (btn === 'edit') {
          this._edit = true;
          updateURL(`profileEdit&edit=${this._edit}`);
          renderTab();
        }
        if (btn === 'delete') await this.#deleteAccount(deleteUserAndData, loginUser);
      } catch (err) {
        throw err;
      }
    });
  }

  async #deleteAccount(deleteUserAndData, loginUser) {
    try {
      reAuthUser.showForm();
      this._reAuthUserEmailPass = await reAuthUser.getReAuthInfo();
      //hide form
      reAuthUser.hideForm();

      const email = this._reAuthUserEmailPass.reAuthEmail;
      const password = this._reAuthUserEmailPass.reAuthPass;

      //if user cancel the process exit from fn
      if (!email || !password) return;

      await this.Delay(1000);

      const userConfirmation = confirm('Are you sure you want to delete your account? once done this operation can\'t be reversed');

      if (!userConfirmation) return this.renderMessage('Great! You decided to stay :)', 'def', 5000);

      //login user again
      const currUser = await loginUser(email, password);

      await this.renderMessage('Deleting your account', 'success', 1500);

      const isDeleted = await deleteUserAndData(this._data.data, currUser);

      if (isDeleted) await this.renderMessage('Account deleted, Redirecting to login page', 'success', 2000);

      //set isLogin to false 
      sessionStorage.removeItem('isLogin');
      updateURL('_', true);
    } catch (err) {
      throw err
    }
  }

  #setUserPic(user) {
    return user.profilePic ? user.profilePic : defaultUserPic;
  }
}

export default new ProfileView();