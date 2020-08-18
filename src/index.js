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
  // 执行这一步会询问摄像头权限
  videoDevices = videoDevices || (await navigator.mediaDevices.enumerateDevices()).filter((device) => {
    return device.kind === 'videoinput';
  });

  /** @type {Element} 显示扫码界面 */
  const elem = document.body.appendChild(document.createElement('web-scan-code'));
  /** @type {Element} 显示视频流的 video 标签 */
  const video = elem.$refs.video;
  /** @type {DOMRect} 显示视频流的 video 标签元素位置 */
  const videoRect = video.getBoundingClientRect();

  /** @type {MediaStream} 视频流 */
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: videoRect.height,
      height: videoRect.width,
      deviceId: { exact: videoDevices[6].deviceId }
    }
  });

  // 播放视频流
  video.srcObject = stream;
}
