import elementStyle from './web-scan-code.scss?toString';


class WebScanCode extends HTMLElement {
  constructor() {
    super();

    /** @type {ShadowRoot} */
    this.$el = this.attachShadow({ mode: 'open' });
    /** @type {Record<string, Element>} */
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
          <!-- 切换摄像头 -->
          <div ref="toggleCamera" class="toggleCamera">
            <svg viewBox="0 0 1024 1024">
              <path d="M803.328 204.11733333h-112.64L664.064 128.85333333c-3.584-10.752-13.824-17.408-25.088-17.408H385.024c-11.264 0-20.992 7.168-25.088 17.408L332.8 204.11733333H220.16c-36.352 0-66.048 29.696-66.048 66.048v357.888c0 36.352 29.696 66.048 66.048 66.048h582.656c36.352 0 66.048-29.696 66.048-66.048V270.67733333c0.512-36.864-29.184-66.56-65.536-66.56z m6.656 424.448c0 3.584-3.072 6.656-6.656 6.656H220.672c-3.584 0-6.656-3.072-6.656-6.656V270.67733333c0-3.584 3.072-6.656 6.656-6.656h154.624l14.336-39.424 18.944-53.248h207.36l18.944 53.248 14.336 39.424H803.84c3.584 0 6.656 3.072 6.656 6.656v357.888h-0.512z"></path>
              <path d="M512 307.02933333c-73.216 0-132.608 59.392-132.608 132.608s59.392 132.608 132.608 132.608 132.608-59.392 132.608-132.608-59.392-132.608-132.608-132.608z m0 211.968c-44.032 0-79.36-35.328-79.36-79.36s35.328-79.36 79.36-79.36 79.36 35.328 79.36 79.36-35.328 79.36-79.36 79.36z"></path>
              <path d="M991.232 615.25333333c0 114.688-126.464 213.504-321.536 250.88h-5.632c-16.384 1.536-31.232-10.752-32.768-27.136s10.752-31.232 27.136-32.768C819.2 776.53333333 931.84 697.68533333 931.84 615.25333333c0-27.136-11.776-53.76-33.792-78.848-1.536-2.048-3.584-4.096-5.632-6.144-3.584-4.608-5.12-10.752-5.12-16.896 0-16.384 13.312-29.696 29.696-29.696 8.192 0 15.872 3.584 20.992 8.704l2.048 2.048c32.768 36.864 51.2 78.336 51.2 120.832zM591.36 838.48533333l-124.928-99.84c-7.168-5.632-17.408-0.512-17.408 8.192v70.144c-198.656-15.36-356.352-101.376-356.352-201.728 0-30.72 14.336-57.344 34.304-78.848l4.608-4.608c5.12-6.656 7.168-14.848 5.632-24.064-2.56-12.8-13.312-22.528-26.112-23.552-8.192-1.024-15.872 1.536-21.504 6.144-2.048 2.048-4.608 4.608-6.656 7.168-32.256 36.352-49.664 77.312-49.664 118.784 0 136.192 179.2 245.248 416.256 261.632v65.536c0 9.728 11.264 14.848 18.944 9.216l123.392-98.816c4.608-4.096 4.608-11.264-0.512-15.36z"></path>
            </svg>
          </div>
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

    // 点击切换摄像头按钮的事件监听
    $refs.toggleCamera.addEventListener('click', (event) => {
      this.clickToggleCamera();
    });
  }

  /**
   * 保存摄像头信息数组
   * @param {MediaDeviceInfo[]} videoDevices 当前设备摄像头信息数组
   */
  setVideoDevices(videoDevices) {
    this.videoDevices = videoDevices;
  }

  /**
   * 切换摄像头
   * @param {string} deviceId 摄像头 ID
   */
  async toggleUserMedia(deviceId) {
    this.deviceId = deviceId;

    // 关闭已经打开的摄像设备
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    const video = this.$refs.video;
    const videoRect = video.getBoundingClientRect();
    const stream = window.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: videoRect.height,
        height: videoRect.width,
        deviceId: {
          exact: deviceId
        }
      }
    });

    // 播放视频流
    video.srcObject = stream;
  }

  /**
   * 点击了切换摄像头按钮
   */
  clickToggleCamera() {
    const { videoDevices, deviceId } = this;
    const deviceIndex = videoDevices.findIndex((device) => device.deviceId === deviceId);
    const nextDevice = videoDevices[deviceIndex + 1] || videoDevices[0];

    this.toggleUserMedia(nextDevice.deviceId);
  }

  disconnectedCallback() {
    // this.$refs.video.pause();
  }
}

customElements.define('web-scan-code', WebScanCode);