/* eslint-disable import/no-extraneous-dependencies */


import 'webrtc-adapter';
import './components/web-scan-code';


// 测试样式
// document.body.appendChild(document.createElement('web-scan-code'));


/**
 * 打开摄像头进行扫码
 * @param {{}} options
 * @param {Function | undefined} options.success 扫码成功回调
 * @param {Function | undefined} options.error 程序发生错误的回调
 * @param {Function | undefined} options.deviceCall 摄像头调用的回调
 * @param {Function | undefined} options.deviceToggle 切换摄像头的回调
 * @param {Function | undefined} options.open 扫码界面开启的回调
 * @param {Function | undefined} options.close 扫码界面关闭的回调
 * @param {string | undefined} options.deviceId 需要默认开启的摄像头设备 ID
 */
function webScanCode(options = {}) {
  // 网络协议错误
  if (navigator.mediaDevices.getUserMedia === undefined) {
    throw throwError(options, new Error('[web-scan-code] 当前网络协议下无法调用摄像头 ...'));
  }

  /** @type {Element} 显示扫码界面 */
  const elem = document.body.appendChild(
    document.createElement('web-scan-code')
  );

  // 监听扫码成功事件
  elem.addEventListener('decode:ok', (result) => {
    elem.close(2);
    options.success && options.success({ result });
  });
  // 监听摄像头调用事件
  elem.addEventListener('device:call', (newDeviceId) => {
    options.deviceCall && options.deviceCall({ deviceId: newDeviceId });
  });
  // 监听摄像头切换事件
  elem.addEventListener('device:toggle', (newDeviceId) => {
    options.deviceToggle && options.deviceToggle({ deviceId: newDeviceId });
  });
  // 监听报错信息
  elem.addEventListener('error', (error) => {
    throwError(options, error);
  });
  // 监听弹窗打开事件
  elem.addEventListener('open', () => {
    options.open && options.open();
  });
  // 监听弹窗关闭事件
  elem.addEventListener('close', ({ type }) => {
    options.close && options.close({ type });
  });

  // 开启摄像头
  elem.start({
    deviceId: options.deviceId
  });

  return {
    /** 关闭扫码框 */
    close: () => {
      elem.close(3);
    }
  };
}

/**
 * 触发程序发生错误的回调
 */
function throwError(options, error) {
  options.error && options.error(error);
  return error;
}


webScanCode.version = '__VERSION__';


export default webScanCode;
