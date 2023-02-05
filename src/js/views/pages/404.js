import View from '../View.js'
import { updateURL } from '../../helper.js'

class PageNotFound extends View {
  _parentElem = document.querySelector('body');

  init() {
    this.setTitle('Page Not Found');

    document.write('Page not found');
  }
}

export default new PageNotFound();