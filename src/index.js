import 'webrtc-adapter';
import './components/web-scan-code';

/**
 * 当前设备摄像头 ID 数组
 * @type {MediaDeviceInfo[]}
 */
let videoDevices;


/**
 * 打开摄像头进行扫码
 * @param {{}} options
 */
export default async function webScanCode(options = {}) {
  // 网络协议错误
  if (navigator.mediaDevices.getUserMedia === undefined) {
    throw new Error('当前网络协议下无法调用摄像头 ...');
  }

  // 获取当前设备摄像头 ID 数组
  videoDevices = videoDevices || (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
    return device.kind === 'videoinput';
  });

  /** 视频流 */
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: { exact: videoDevices[6].deviceId }
    }
  });
  /** 显示扫码界面 */
  const elem = document.body.appendChild(
    document.createElement('web-scan-code')
  );


  elem.$refs.video.srcObject = stream;
}
