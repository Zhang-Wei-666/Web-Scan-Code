import 'webrtc-adapter';
import './components/web-scan-code';

/**
 * 当前设备摄像头信息数组
 * @type {MediaDeviceInfo[]}
 */
let videoDevices;


// 测试样式
// document.body.appendChild(document.createElement('web-scan-code'));


/**
 * 打开摄像头进行扫码
 * @param {{}} options
 * @param {Function} options.success 扫码成功回调
 */
async function webScanCode(options = {}) {
  // 网络协议错误
  if (navigator.mediaDevices.getUserMedia === undefined) {
    throw new Error('当前网络协议下无法调用摄像头 ...');
  }

  // 获取当前设备摄像头信息数组
  // 执行这一步会询问摄像头权限
  videoDevices = videoDevices || (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
    return device.kind === 'videoinput';
  });

  /** @type {Element} 显示扫码界面 */
  const elem = document.body.appendChild(
    document.createElement('web-scan-code')
  );

  // 写入摄像头信息数组
  elem.setVideoDevices(videoDevices);
  // 开启摄像头
  elem.toggleVideoDevice(videoDevices[0].deviceId);

  // 监听扫码成功事件
  elem.addEventListener('decode:ok', (result) => {
    elem.parentNode.removeChild(elem);
    options.success && options.success({
      result
    });
  });
}


webScanCode.version = '__VERSION__';


export default webScanCode;
