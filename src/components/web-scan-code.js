import elementStyle from './web-scan-code.scss?toString';


class WebScanCode extends HTMLElement {
  constructor() {
    super();

    this.$el = this.attachShadow({ mode: 'open' });
    this.$refs = {};

    this.render();
  }

  /**
   * 渲染元素内容
   */
  render() {
    const { $el, $refs } = this;
    const elementTemplate = document.createElement('template');

    // 安装 VSCode 的 lit-html 插件就可以高亮
    elementTemplate.innerHTML = process.env.html`
      <style>${elementStyle}</style>
      <div id="app">
        <!-- 标题区域 -->
        <div id="header">
          <!-- 关闭按钮 -->
          <svg class="close" viewBox="0 0 1024 1024">
            <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8c-14.7 12.8-14.7 35.6 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
          </svg>
          <!-- 竖线 -->
          <div class="gap"></div>
          <!-- 标题 -->
          <div class="title">扫一扫</div>
        </div>
        <div id="content">
          <!-- 视频流显示 -->
          <video ref="video" playsinline autoplay></video>
        </div>
      </div>
    `;

    // 写入元素内容
    $el.appendChild(
      elementTemplate.content.cloneNode(true)
    );

    // 查找所有注册的引用信息
    Array.from($el.querySelectorAll('[ref]')).forEach((elem) => {
      $refs[elem.getAttribute('ref')] = elem;
    });
  }

  disconnectedCallback() {
    // this.$refs.video.pause();
  }
}

customElements.define('web-scan-code', WebScanCode);
