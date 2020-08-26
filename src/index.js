import 'webrtc-adapter';
import './components/web-scan-code';


// 测试样式
// document.body.appendChild(document.createElement('web-scan-code'));


/**
 * 打开摄像头进行扫码
 * @param {{}} options
 * @param {Function | undefined} options.success 扫码成功回调
 * @param {Function | undefined} options.deviceToggle 切换摄像头的回调
 * @param {string | undefined} options.deviceId 需要默认开启的摄像头设备 ID
 */
async function webScanCode(options = {}) {
  // 网络协议错误
  if (navigator.mediaDevices.getUserMedia === undefined) {
    throw new Error('当前网络协议下无法调用摄像头 ...');
  }

  /** @type {Element} 显示扫码界面 */
  const elem = document.body.appendChild(
    document.createElement('web-scan-code')
  );

  // 开启摄像头
  elem.start({
    deviceId: options.deviceId
  });

  // 监听扫码成功事件
  elem.addEventListener('decode:ok', (result) => {
    elem.parentNode.removeChild(elem);
    options.success && options.success({
      result
    });
  });
  // 监听摄像头切换事件
  elem.addEventListener('device:toggle', (newDeviceId) => {
    options.deviceToggle && options.deviceToggle({
      deviceId: newDeviceId
    });
  });
}


webScanCode.version = '__VERSION__';


export default webScanCode;
