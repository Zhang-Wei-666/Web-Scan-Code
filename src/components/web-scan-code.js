import elementStyle from './web-scan-code.scss?toString';


const elementTemplate = document.createElement('template');

elementTemplate.innerHTML = process.env.html`
  <style>${elementStyle}</style>
  <div>
    <video ref="video" playsinline autoplay></video>
  </div>
`;

class WebScanCode extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.$el = this.attachShadow({ mode: 'open' });
    const refs = this.$refs = {};

    shadowRoot.appendChild(
      elementTemplate.content.cloneNode(true)
    );

    Array.from(shadowRoot.querySelectorAll('[ref]')).forEach((elem) => {
      refs[elem.getAttribute('ref')] = elem;
    });
  }

  disconnectedCallback() {
    // this.$refs.video.pause();
  }
}

customElements.define('web-scan-code', WebScanCode);
