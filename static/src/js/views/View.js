export default class View {
  _data;
  _parentElem;

  renderData(data, clearParent = true) {
    this._data = data;

    const markup = this._generateMarkup();

    if (clearParent) this.clear();

    this._parentElem.insertAdjacentHTML('beforeend', markup);
  }

  setTitle(title) {
    document.title = title;
  }

  Delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  loader() {
    const html = `
    <section class="section-loader">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"/></g></svg>
      
      <p>Loading... </p>
    </section>`

    this.clear();
    this._parentElem.insertAdjacentHTML('afterbegin', html);

    return Promise.resolve();
  }

  clear() {
    this._parentElem.innerHTML = '';
  }

  renderError(msg, className) {
    const sectionError = document.querySelector('.section__error');
    const errorMsgElem = sectionError.querySelector('p');
    errorMsgElem.textContent = msg;
    sectionError.classList.add(className);

    if (className === 'default') this.clear();

    //remove a 2 secssecs
    setTimeout(() => {
      sectionError.classList.remove(className);
      errorMsgElem.textContent = '';
    }, 2000);
  }
}