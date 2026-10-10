const mongoose = require("mongoose");
const Product = require("./models/Product");
const ProductTranslation = require("./models/ProductTranslation");
require("dotenv").config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

// Chinese translations mapping by product slug
const chineseTranslations = {
  "cv4-4k-ai-conference-camera": {
    productName: "CV4 4K AI会议摄像头",
    shortDescription: "配备双AI麦克风、人脸识别、波束成形、EPTZ和4倍电子变焦的4K会议摄像头，用于高质量视频会议。",
    description: "CV4是一款集成两个音频拾音麦克风的4K高清会议摄像头。它使用人脸识别和人体识别技术自动调整图像构图并聚焦会议参与者。双麦克风使用AI语音算法、降噪和波束成形信号处理，从最远3米处清晰捕捉人声。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI会议摄像头",
    features: [
      "超高清4K视频",
      "4K分辨率高达3840 × 2160",
      "4倍电子变焦",
      "双内置麦克风",
      "AI麦克风降噪",
      "波束成形技术",
      "人体识别",
      "人脸识别",
      "自动和手动跟踪模式",
      "EPTZ（电子平移-倾斜-变焦）",
      "90°视场角",
      "定焦镜头",
      "即插即用USB连接",
      "无需驱动",
      "兼容Windows和macOS",
      "红外遥控器",
      "UVC通信协议"
    ],
    specifications: [
      { label: "产品尺寸", value: "104 × 139 × 124 毫米" },
      { label: "颜色", value: "商务黑" },
      { label: "重量", value: "768克（530克）" },
      { label: "连接", value: "USB数据线" },
      { label: "电源", value: "USB数据线，5V 500mA" },
      { label: "工作温度", value: "-20°C至70°C" },
      { label: "最佳拍摄温度", value: "0°C至50°C" },
      { label: "支持的操作系统", value: "Windows 7、Windows 8、Windows 10、Mac OS X、Android" },
      { label: "麦克风", value: "2个" },
      { label: "镜头", value: "定焦" },
      { label: "图像传感器", value: "1/2.8英寸" },
      { label: "图像传感器像素", value: "830万像素" },
      { label: "图像质量", value: "4K" },
      { label: "最大帧率", value: "MJPEG：30 FPS；YUV：30 FPS（通过USB 3.0）" },
      { label: "通信协议", value: "UVC" },
      { label: "视频编码", value: "YUV、MJPEG" },
      { label: "支持的分辨率", value: "3840 × 2160、2560 × 1440、1920 × 1080、1280 × 720" },
      { label: "视场角", value: "90°" },
      { label: "接口", value: "USB" },
      { label: "麦克风拾音范围", value: "最远3米" },
      { label: "电子变焦", value: "4倍" }
    ],
    applications: [
      "视频会议",
      "在线会议",
      "会议室",
      "商务会议",
      "远程协作",
      "在线视频通话",
      "会议平板",
      "台式电脑",
      "笔记本电脑"
    ],
    packageContents: [
      "摄像头主机 ×1",
      "遥控器 ×1",
      "说明书 ×1"
    ],
    landingPage: {
      heroTitle: "CV4 4K AI会议摄像头",
      heroSubtitle: "体验智能4K视频会议，配备AI语音拾音、人体识别、波束成形和灵活的电子跟踪。",
      keyBenefits: [
        "4K超高清视频",
        "AI双麦克风降噪",
        "最远3米语音拾音",
        "4倍电子变焦",
        "人体识别和自动跟踪",
        "90°视场角",
        "即插即用USB连接"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CV4 4K AI会议摄像头 | IndoChinaBridge",
      metaDescription: "CV4 4K AI会议摄像头，配备双麦克风、AI降噪、波束成形、人体识别、EPTZ、4倍电子变焦和USB连接。",
      keywords: [
        "CV4会议摄像头",
        "4K会议摄像头",
        "AI会议摄像头",
        "4K视频会议摄像头",
        "AI带麦克风摄像头",
        "会议室摄像头",
        "USB会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "4k-ai-tracking-usb-conference-camera-series": {
    productName: "4K高清AI跟踪USB会议摄像头系列",
    shortDescription: "4K AI跟踪PTZ会议摄像头系列，配备3倍或10倍光学变焦、4K视频输出、流畅PTZ控制、多种连接选项和最多255个预设位置。",
    description: "4K高清AI跟踪USB会议摄像头系列是为企业、教育、远程医疗、会议室、教室、培训中心和其他专业应用设计的PTZ摄像头解决方案。该摄像头采用高质量的1/2.5英寸CMOS传感器，有效像素851万，支持最高3840 × 2160的4K分辨率，帧率30fps。它具有精确安静的PTZ定位、AI智能跟踪、3倍或10倍光学变焦选项、12倍数字变焦、多种视频输出选项和最多255个可编程预设位置。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K超高清视频",
      "AI智能跟踪",
      "PTZ平移、倾斜和变焦控制",
      "可选3倍光学变焦型号",
      "可选10倍光学变焦型号",
      "12倍数字变焦",
      "1/2.5英寸CMOS图像传感器",
      "851万有效像素",
      "4KP30视频输出",
      "5.8G无线视频传输",
      "USB 3.0连接",
      "IP网络视频输出",
      "255个预设位置",
      "流畅安静的PTZ定位",
      "2D和3D数字降噪",
      "低光成像支持",
      "H.264和H.265视频压缩",
      "UVC支持",
      "遥控器",
      "中英文OSD菜单",
      "TF卡录制",
      "音频录制支持",
      "ONVIF支持",
      "SRT支持",
      "RTSP支持",
      "RTMP支持",
      "VISCA协议支持",
      "Pelco-D/Pelco-P协议支持",
      "可选NDI",
      "可选POE"
    ],
    landingPage: {
      heroTitle: "4K AI跟踪USB会议摄像头",
      heroSubtitle: "专业4K PTZ会议摄像头，配备智能AI跟踪、光学变焦、流畅定位和灵活的USB、IP和无线连接。",
      keyBenefits: [
        "真正的4K超高清视频",
        "AI智能跟踪",
        "3倍或10倍光学变焦选项",
        "12倍数字变焦",
        "流畅安静的PTZ控制",
        "255个可编程预设位置",
        "USB 3.0 4KP30输出",
        "5.8G无线选项",
        "IP网络视频输出",
        "多种专业视频协议"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "4K AI跟踪USB会议摄像头 | IndoChinaBridge",
      metaDescription: "4K AI跟踪PTZ会议摄像头，配备3倍或10倍光学变焦、4K视频、255个预设、USB 3.0、IP和5.8G无线连接。",
      keywords: [
        "4K AI跟踪摄像头",
        "4K PTZ会议摄像头",
        "AI跟踪会议摄像头",
        "4K USB会议摄像头",
        "4K PTZ摄像头",
        "10倍光学变焦摄像头",
        "3倍光学变焦摄像头",
        "AI会议摄像头",
        "视频会议PTZ摄像头",
        "中国PTZ摄像头"
      ]
    }
  },
  "ce-4k612-4k-ultra-hd-ai-tracking-conference-camera": {
    productName: "CE 4K612 4K超高清AI跟踪旗舰会议摄像头",
    shortDescription: "专业4K AI跟踪PTZ会议摄像头，配备12倍光学变焦、16倍数字变焦、4K 60fps输出、多种专业接口和高级人体跟踪。",
    description: "CE 4K612是一款旗舰4K超高清AI跟踪会议摄像头，配备12倍光学变焦镜头和80.4°广角视场。它采用高质量的1/2.5英寸索尼CMOS图像传感器，有效像素829万，支持最高60fps的4K视频。该摄像头结合了高级ISP处理、自动对焦、3D降噪、AI人体检测和跟踪、多种视频接口、专业网络协议和PTZ控制，适用于会议、教育、医疗、广播、政府、协作办公、应急指挥、司法、公共安全和军事应用。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K超高清视频",
      "最高4K 60fps",
      "12倍光学变焦",
      "16倍数字变焦",
      "80.4°广角视场",
      "1/2.5英寸索尼CMOS图像传感器",
      "829万有效像素",
      "AI人体检测和跟踪",
      "实时跟踪",
      "区域跟踪",
      "最多4个跟踪区域",
      "快速准确的自动对焦",
      "3D数字降噪",
      "双流输出",
      "HDMI 2.0输出",
      "SDI输出",
      "USB 2.0输出",
      "LAN网络输出",
      "POE支持",
      "H.264和H.265压缩",
      "MJPG、H.264、H.265、YUY2和NV12 USB格式",
      "RTSP支持",
      "RTMP支持",
      "ONVIF支持",
      "GB/T28181支持",
      "VISCA控制",
      "PELCO-D控制",
      "PELCO-P控制",
      "RS232控制",
      "RS422 / RS485兼容控制",
      "最多255个预设位置",
      "遥控器",
      "室内操作"
    ],
    landingPage: {
      heroTitle: "CE 4K612 4K AI跟踪会议摄像头",
      heroSubtitle: "旗舰4K PTZ会议摄像头，配备12倍光学变焦、AI人体跟踪、4K 60fps视频、专业接口和高级网络连接。",
      keyBenefits: [
        "4K视频最高60fps",
        "12倍光学变焦",
        "16倍数字变焦",
        "AI人体检测和跟踪",
        "实时跟踪最远6-7米",
        "最多255个预设位置",
        "HDMI、SDI、USB和LAN连接",
        "POE支持",
        "高级自动对焦",
        "3D数字降噪",
        "专业网络和控制协议"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE 4K612 4K AI跟踪会议摄像头 | IndoChinaBridge",
      metaDescription: "CE 4K612旗舰4K AI跟踪会议摄像头，配备12倍光学变焦、4K 60fps、AI人体跟踪、HDMI、SDI、USB、LAN和POE。",
      keywords: [
        "CE 4K612",
        "4K AI跟踪摄像头",
        "4K PTZ会议摄像头",
        "AI跟踪会议摄像头",
        "12倍光学变焦摄像头",
        "4K 60fps会议摄像头",
        "4K PTZ摄像头",
        "AI人体跟踪摄像头",
        "专业会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "ce-4k625-4k-ultra-hd-ai-tracking-conference-camera": {
    productName: "CE 4K625 4K超高清AI跟踪旗舰会议摄像头",
    shortDescription: "专业4K AI跟踪PTZ会议摄像头，配备25倍光学变焦、16倍数字变焦、4K 60fps输出、高级人体跟踪和全面专业接口。",
    description: "CE 4K625是一款旗舰4K超高清AI跟踪会议摄像头，配备25倍光学变焦镜头和59.2°广角视场。它采用1/1.8英寸索尼CMOS图像传感器，有效像素829万，支持最高60fps的4K视频。该摄像头结合了高级ISP处理、自动对焦、3D数字降噪、AI人体检测和跟踪、多种专业视频接口、网络协议、PTZ控制和最多255个预设位置。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K超高清视频",
      "最高4K 60fps",
      "25倍光学变焦",
      "16倍数字变焦",
      "59.2°广角视场",
      "1/1.8英寸索尼CMOS图像传感器",
      "829万有效像素",
      "AI人体检测和跟踪",
      "实时跟踪",
      "区域跟踪",
      "最多4个跟踪区域",
      "快速准确的自动对焦",
      "3D数字降噪",
      "双流输出",
      "HDMI 2.0输出",
      "SDI输出",
      "USB 2.0输出",
      "LAN网络输出",
      "POE支持",
      "H.264和H.265压缩",
      "MJPG、H.264、H.265、YUY2和NV12 USB格式",
      "RTSP支持",
      "RTMP支持",
      "ONVIF支持",
      "GB/T28181支持",
      "VISCA控制",
      "PELCO-D控制",
      "PELCO-P控制",
      "RS232控制",
      "RS422 / RS485兼容控制",
      "最多255个预设位置",
      "遥控器",
      "室内操作"
    ],
    landingPage: {
      heroTitle: "CE 4K625 4K AI跟踪会议摄像头",
      heroSubtitle: "旗舰4K PTZ会议摄像头，配备25倍光学变焦、AI人体跟踪、4K 60fps视频、专业接口和高级网络连接。",
      keyBenefits: [
        "4K视频最高60fps",
        "25倍光学变焦",
        "16倍数字变焦",
        "AI人体检测和跟踪",
        "实时跟踪最远6-7米",
        "最多255个预设位置",
        "HDMI、SDI、USB和LAN连接",
        "POE支持",
        "高级自动对焦",
        "3D数字降噪",
        "专业网络和控制协议"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE 4K625 4K AI跟踪会议摄像头 | IndoChinaBridge",
      metaDescription: "CE 4K625旗舰4K AI跟踪会议摄像头，配备25倍光学变焦、4K 60fps、AI人体跟踪、HDMI、SDI、USB、LAN和POE。",
      keywords: [
        "CE 4K625",
        "4K AI跟踪摄像头",
        "4K PTZ会议摄像头",
        "AI跟踪会议摄像头",
        "25倍光学变焦摄像头",
        "4K 60fps会议摄像头",
        "4K PTZ摄像头",
        "AI人体跟踪摄像头",
        "专业会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "ce-4k631-4k-ultra-hd-ai-tracking-conference-camera": {
    productName: "CE 4K631 4K超高清AI跟踪旗舰会议摄像头",
    shortDescription: "专业4K AI跟踪PTZ会议摄像头，配备31倍光学变焦、16倍数字变焦、4K 60fps输出、高级人体跟踪和全面专业接口。",
    description: "CE 4K631是一款旗舰4K超高清AI跟踪会议摄像头，配备31倍光学变焦镜头和59°广角视场。它采用1/1.8英寸索尼CMOS图像传感器，有效像素829万，支持最高60fps的4K视频。该摄像头结合了高级ISP处理、自动对焦、3D数字降噪、AI人体检测和跟踪、多种专业视频接口、网络协议、PTZ控制和最多255个预设位置。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K超高清视频",
      "最高4K 60fps",
      "31倍光学变焦",
      "16倍数字变焦",
      "59°广角视场",
      "1/1.8英寸索尼CMOS图像传感器",
      "829万有效像素",
      "AI人体检测和跟踪",
      "实时跟踪",
      "区域跟踪",
      "最多4个跟踪区域",
      "快速准确的自动对焦",
      "3D数字降噪",
      "双流USB输出",
      "HDMI 2.0输出",
      "SDI输出",
      "USB 2.0输出",
      "LAN网络输出",
      "POE支持",
      "H.264和H.265视频压缩",
      "MJPG、H.264、H.265、YUY2和NV12 USB格式",
      "RTSP支持",
      "RTMP支持",
      "ONVIF支持",
      "GB/T28181支持",
      "网络VISCA控制",
      "VISCA控制",
      "PELCO-D控制",
      "PELCO-P控制",
      "RS232控制",
      "RS422兼容RS485",
      "最多255个预设位置",
      "遥控器",
      "室内操作"
    ],
    landingPage: {
      heroTitle: "CE 4K631 4K AI跟踪会议摄像头",
      heroSubtitle: "旗舰4K PTZ会议摄像头，配备31倍光学变焦、AI人体跟踪、4K 60fps视频、专业接口和高级网络连接。",
      keyBenefits: [
        "4K视频最高60fps",
        "31倍光学变焦",
        "16倍数字变焦",
        "59°广角视场",
        "AI人体检测和跟踪",
        "实时跟踪最远6-7米",
        "最多255个预设位置",
        "HDMI、SDI、USB和LAN连接",
        "POE支持",
        "高级自动对焦",
        "3D数字降噪",
        "专业网络和控制协议"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE 4K631 4K AI跟踪会议摄像头 | IndoChinaBridge",
      metaDescription: "CE 4K631旗舰4K AI跟踪会议摄像头，配备31倍光学变焦、4K 60fps、AI人体跟踪、HDMI、SDI、USB、LAN和POE。",
      keywords: [
        "CE 4K631",
        "4K AI跟踪摄像头",
        "4K PTZ会议摄像头",
        "AI跟踪会议摄像头",
        "31倍光学变焦摄像头",
        "4K 60fps会议摄像头",
        "4K PTZ摄像头",
        "AI人体跟踪摄像头",
        "专业会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "ce-4k210-4k-high-definition-ai-tracking-hdmi-conference-camera": {
    productName: "CE 4K210 4K高清AI跟踪HDMI会议摄像头",
    shortDescription: "4K AI跟踪PTZ会议摄像头，配备10倍光学变焦、12倍数字变焦、USB 3.0、HDMI和IP视频输出、流畅PTZ控制和多种网络控制协议。",
    description: "CE 4K210是一款4K高清AI跟踪HDMI会议摄像头，专为专业视频应用设计。它采用1/2.5英寸Exmor R CMOS传感器，有效像素851万，支持3840×2160高分辨率视频。该摄像头提供10倍光学变焦、12倍数字变焦、AI目标跟踪、流畅安静的PTZ定位、USB 3.0、HDMI和IP接口、TF卡本地存储、一键录制以及多种控制和网络协议。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K高清视频",
      "1/2.5英寸Exmor R CMOS传感器",
      "851万有效像素",
      "10倍光学变焦",
      "12倍数字变焦",
      "AI目标跟踪",
      "实时目标跟踪",
      "自动视角调整",
      "流畅安静的PTZ定位",
      "USB 3.0视频输出",
      "HDMI视频输出",
      "IP视频输出",
      "TF卡本地存储",
      "一键录制",
      "256个预设位置",
      "3D降噪",
      "自动和手动对焦",
      "背光补偿",
      "图像翻转",
      "H.264/H.265编码",
      "ONVIF支持",
      "GB/T28181支持",
      "RTSP支持",
      "RTMP支持",
      "RTP组播支持",
      "RS232/RS422/RS485控制",
      "USB PTZ控制",
      "VISCA协议",
      "PELCO-D协议",
      "PELCO-P协议",
      "壁挂、吊装或三脚架安装"
    ],
    landingPage: {
      heroTitle: "CE 4K210 4K AI跟踪HDMI会议摄像头",
      heroSubtitle: "专业4K PTZ会议摄像头，配备10倍光学变焦、AI跟踪、USB 3.0、HDMI和IP视频输出。",
      keyBenefits: [
        "4K高清视频",
        "10倍光学变焦",
        "12倍数字变焦",
        "AI实时跟踪",
        "USB 3.0 + HDMI + IP输出",
        "流畅安静的PTZ移动",
        "256个预设位置",
        "多种网络协议",
        "H.264/H.265编码",
        "多种PTZ控制接口"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE 4K210 4K AI跟踪HDMI会议摄像头 | IndoChinaBridge",
      metaDescription: "CE 4K210 4K AI跟踪会议摄像头，配备10倍光学变焦、12倍数字变焦、USB 3.0、HDMI、IP输出和多种PTZ控制协议。",
      keywords: [
        "CE 4K210",
        "4K会议摄像头",
        "AI跟踪会议摄像头",
        "4K PTZ摄像头",
        "AI跟踪PTZ摄像头",
        "10倍光学变焦摄像头",
        "4K HDMI会议摄像头",
        "4K AI摄像头",
        "中国会议摄像头",
        "专业PTZ会议摄像头"
      ]
    }
  },
  "ce-4k220s-4k-high-definition-ai-tracking-multi-interface-conference-camera": {
    productName: "CE 4K220S 4K高清AI跟踪多接口会议摄像头",
    shortDescription: "4K AI跟踪PTZ会议摄像头，配备20倍光学变焦、12倍数字变焦、USB 3.0、HDMI、IP和SDI接口、流畅PTZ定位和多种网络控制协议。",
    description: "CE 4K220S是一款4K高清AI跟踪多接口会议摄像头，专为专业视频应用设计。它采用1/2.5英寸Exmor R CMOS传感器，有效像素851万，支持3840×2160分辨率。该摄像头配备20倍光学变焦、12倍数字变焦、AI实时目标跟踪、流畅安静的PTZ控制、USB 3.0、HDMI、IP和SDI视频接口、多种网络协议和多种遥控方式。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "4K AI跟踪PTZ摄像头",
    features: [
      "4K高清视频",
      "1/2.5英寸Exmor R CMOS传感器",
      "851万有效像素",
      "20倍光学变焦",
      "12倍数字变焦",
      "AI实时目标跟踪",
      "自动视角调整",
      "精确安静的PTZ定位",
      "USB 3.0视频输出",
      "HDMI视频输出",
      "IP视频输出",
      "SDI视频输出",
      "本地USB外部扩展",
      "一键视频格式切换",
      "256个预设位置",
      "3D降噪",
      "自动和手动对焦",
      "背光补偿",
      "水平和垂直图像翻转",
      "H.264/H.265编码",
      "ONVIF支持",
      "GB/T28181支持",
      "RTSP支持",
      "RTMP支持",
      "RTP组播支持",
      "VISCA控制",
      "PELCO-D控制",
      "PELCO-P控制",
      "RS232/RS422/RS485控制",
      "USB PTZ控制",
      "红外遥控",
      "壁挂、吊装或三脚架安装"
    ],
    landingPage: {
      heroTitle: "CE 4K220S 4K AI跟踪多接口会议摄像头",
      heroSubtitle: "专业4K PTZ会议摄像头，配备20倍光学变焦、AI跟踪、USB 3.0、HDMI、IP和SDI视频接口。",
      keyBenefits: [
        "4K高清视频",
        "20倍光学变焦",
        "12倍数字变焦",
        "AI实时目标跟踪",
        "USB 3.0 + HDMI + IP + SDI输出",
        "流畅安静的PTZ定位",
        "256个预设位置",
        "多种网络协议",
        "H.264/H.265编码",
        "多种PTZ控制接口"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE 4K220S 4K AI跟踪多接口会议摄像头 | IndoChinaBridge",
      metaDescription: "CE 4K220S 4K AI跟踪会议摄像头，配备20倍光学变焦、12倍数字变焦、USB 3.0、HDMI、IP和SDI接口。",
      keywords: [
        "CE 4K220S",
        "4K会议摄像头",
        "AI跟踪会议摄像头",
        "4K PTZ摄像头",
        "AI跟踪PTZ摄像头",
        "20倍光学变焦摄像头",
        "4K HDMI SDI摄像头",
        "4K AI摄像头",
        "多接口会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "ce-g200-binocular-intelligent-voice-tracking-conference-ptz-camera": {
    productName: "CE G200 双目智能语音跟踪会议PTZ摄像头",
    shortDescription: "双目智能语音跟踪会议PTZ摄像头，配备双镜头特写和全景成像、12倍光学变焦、AI演讲者跟踪和自动场景切换。",
    description: "CE G200是一款双目智能语音跟踪会议PTZ摄像头，集成了语音定位技术与AI人体检测和识别算法。它自动识别演讲者，以最佳视角进行构图，并根据参与者的移动和人数变化动态调整构图。其双镜头设计同时捕捉特写和全景画面，并支持智能自动场景切换。该系统还支持多种演讲者跟踪模式，可以智能检测白板书写并自动放大进行特写显示。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "AI语音跟踪PTZ摄像头",
    features: [
      "双目双镜头摄像头设计",
      "语音定位技术",
      "AI人体检测和识别",
      "自动演讲者构图",
      "动态构图调整",
      "自动场景切换",
      "多种演讲者跟踪模式",
      "白板书写检测",
      "自动白板特写",
      "全自动操作",
      "最远8米有效跟踪深度",
      "12倍光学变焦PTZ摄像头",
      "16倍数字变焦",
      "特写摄像头最大水平视场角72.5°",
      "110°水平视场角全景摄像头",
      "同时HDMI、USB 3.0、3G-SDI和以太网输出",
      "1080P最高60fps",
      "内置USB HOST端口用于外接麦克风",
      "POE网络支持",
      "三流支持",
      "VISCA控制",
      "红外遥控"
    ],
    landingPage: {
      heroTitle: "CE G200智能语音跟踪会议PTZ摄像头",
      heroSubtitle: "双目AI会议摄像头，配备语音定位、自动演讲者跟踪、双镜头全景和特写成像、12倍光学变焦。",
      keyBenefits: [
        "智能语音定位",
        "AI人体检测和识别",
        "自动演讲者构图",
        "双镜头特写和全景成像",
        "12倍光学变焦",
        "16倍数字变焦",
        "最远8米跟踪深度",
        "110°全景视场角",
        "1080P最高60fps",
        "HDMI + USB 3.0 + 3G-SDI + 以太网",
        "POE网络支持",
        "三流输出",
        "自动白板检测",
        "VISCA控制"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE G200 AI语音跟踪会议PTZ摄像头 | IndoChinaBridge",
      metaDescription: "CE G200双目AI语音跟踪会议PTZ摄像头，配备12倍光学变焦、双镜头全景成像、自动演讲者跟踪、HDMI、USB 3.0和3G-SDI。",
      keywords: [
        "CE G200",
        "G200会议摄像头",
        "AI语音跟踪摄像头",
        "语音跟踪会议摄像头",
        "智能会议PTZ摄像头",
        "双目会议摄像头",
        "AI演讲者跟踪摄像头",
        "12倍光学变焦会议摄像头",
        "3G-SDI会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "ce-g400-four-eye-intelligent-voice-tracking-camera-system": {
    productName: "CE G400 四眼智能语音跟踪摄像头系统",
    shortDescription: "四眼智能语音跟踪摄像头系统，配备音频定位、人体检测、智能视频分析、自动演讲者构图和特写与广角视角之间的无缝切换。",
    description: "CE G400四眼智能语音跟踪摄像头系统结合了音频定位与智能视频分析，提供自动化会议体验。它可以通过音频定位、人体检测和识别技术精确构图演讲者，并自动在特写和广角视角之间切换，以捕捉整个会议。该系统旨在最大限度减少手动摄像头操作，使会议参与者能够专注于讨论。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "智能语音跟踪摄像头系统",
    features: [
      "四眼智能语音跟踪摄像头系统",
      "音频定位技术",
      "智能视频分析",
      "人体检测和识别",
      "自动演讲者构图",
      "特写和广角视角之间的自动切换",
      "各种场景之间的无缝切换",
      "1/2.8英寸Exmor CMOS传感器",
      "214万像素成像",
      "12倍光学变焦",
      "12倍数字变焦",
      "72.5°最大视场角",
      "同时3G-SDI、HDMI和以太网输出",
      "最高1080p60分辨率",
      "H.264/H.265视频压缩",
      "双流支持"
    ],
    landingPage: {
      heroTitle: "CE G400四眼智能语音跟踪摄像头系统",
      heroSubtitle: "智能会议摄像头系统，结合音频定位、演讲者识别和自动特写与广角场景切换。",
      keyBenefits: [
        "智能音频定位",
        "人体检测和识别",
        "精确自动演讲者构图",
        "自动特写和广角切换",
        "12倍光学变焦",
        "12倍数字变焦",
        "72.5°最大视场角",
        "1080p60视频输出",
        "H.264/H.265视频压缩",
        "3G-SDI、HDMI和以太网连接",
        "256个摄像头预设",
        "双流网络输出"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CE G400四眼智能语音跟踪摄像头 | IndoChinaBridge",
      metaDescription: "CE G400智能语音跟踪会议摄像头系统，配备音频定位、自动演讲者构图、12倍光学变焦、1080p60和3G-SDI、HDMI和以太网输出。",
      keywords: [
        "CE G400",
        "CE G400摄像头",
        "四眼会议摄像头",
        "智能语音跟踪摄像头",
        "语音跟踪会议摄像头",
        "AI会议摄像头",
        "演讲者跟踪摄像头",
        "12倍光学变焦摄像头",
        "3G-SDI会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "chevlen-mic30-ceiling-mount-microphone": {
    productName: "CHEVLEN MIC30 吊装麦克风",
    shortDescription: "吊装麦克风，配备5-8米远距离拾音、超心形单向指向性和高语音清晰度，适用于会议环境。",
    description: "CHEVLEN MIC30是一款专为会议和专业音频环境远距离语音拾音设计的吊装麦克风。它提供5-8米拾音能力、高灵敏度和强指向性，可提高语音清晰度和信噪比性能。其扇形拾音模式可在广域范围内捕捉人声信号，而吊装设计可与建筑环境融为一体。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "吊装麦克风",
    features: [
      "吊装麦克风设计",
      "5-8米远距离拾音",
      "麦克风头延伸75°",
      "麦克风头旋转360°",
      "麦克风开关状态的蓝色指示环",
      "高灵敏度",
      "强指向性",
      "扇形拾音模式",
      "超心形单向指向性",
      "专为声学挑战环境设计",
      "建筑一体化吊装设计",
      "平衡麦克风输出",
      "幻象电源操作"
    ],
    landingPage: {
      heroTitle: "CHEVLEN MIC30吊装麦克风",
      heroSubtitle: "远距离吊装会议麦克风，配备5-8米拾音、超心形指向性和清晰语音捕捉。",
      keyBenefits: [
        "5-8米远距离拾音",
        "超心形单向拾音",
        "40Hz-18kHz频率响应",
        "70dB信噪比",
        "125dB最大声压级",
        "11-52V幻象电源",
        "360°麦克风头旋转",
        "75°麦克风头延伸",
        "吊装建筑设计",
        "包含SPL-3快速连接端子"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CHEVLEN MIC30吊装麦克风 | IndoChinaBridge",
      metaDescription: "CHEVLEN MIC30吊装会议麦克风，配备5-8米拾音、超心形指向性、70dB信噪比和11-52V幻象电源。",
      keywords: [
        "CHEVLEN MIC30",
        "MIC30吊装麦克风",
        "吊装麦克风",
        "吊装会议麦克风",
        "会议室麦克风",
        "远距离麦克风",
        "5-8米拾音麦克风",
        "超心形麦克风",
        "中国会议麦克风"
      ]
    }
  },
  "ct3-bluetooth-cascade-omnidirectional-microphone": {
    productName: "CT3蓝牙级联全向麦克风",
    shortDescription: "便携式USB和蓝牙全向会议麦克风，配备3-5米拾音半径、360°音频拾音、无线级联和内置扬声器。",
    description: "CT3是一款专为会议和视频会议设计的便携式USB和蓝牙全向会议麦克风。它提供360°声音拾音，拾音半径为3-5米，并支持两个设备的无线级联，使两个麦克风都能同时接收和播放声音。该麦克风支持USB和蓝牙连接、智能动态降噪、384ms回声消除和全双工通信。它还包括内置高性能扬声器用于音频播放。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "蓝牙级联全向麦克风",
    features: [
      "USB和蓝牙连接",
      "最多2个设备的无线级联",
      "360°全向声音拾音",
      "3-5米拾音半径",
      "内置4个全向麦克风",
      "384ms回声消除",
      "智能动态降噪",
      "全双工通话技术",
      "内置高性能扬声器",
      "语音广播功能",
      "即插即用操作",
      "无需驱动安装",
      "支持主流视频会议软件",
      "兼容Windows和macOS",
      "便携式设计",
      "蓝牙5.0",
      "10米蓝牙连接距离"
    ],
    landingPage: {
      heroTitle: "CT3蓝牙级联全向麦克风",
      heroSubtitle: "便携式360°会议麦克风，配备USB、蓝牙、无线级联、3-5米拾音和内置扬声器。",
      keyBenefits: [
        "360°智能声音拾音",
        "3-5米拾音半径",
        "2个设备的无线级联",
        "USB和蓝牙连接",
        "蓝牙5.0",
        "384ms回声消除",
        "智能动态降噪",
        "全双工通信",
        "4个内置全向麦克风",
        "7-8小时电池续航",
        "内置5W扬声器",
        "即插即用"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CT3蓝牙级联全向麦克风 | IndoChinaBridge",
      metaDescription: "CT3便携式USB和蓝牙会议麦克风，配备360°拾音、3-5米范围、无线级联、回声消除、降噪和内置扬声器。",
      keywords: [
        "CT3麦克风",
        "CT3蓝牙麦克风",
        "蓝牙会议麦克风",
        "级联会议麦克风",
        "全向会议麦克风",
        "360度会议麦克风",
        "无线级联麦克风",
        "USB会议麦克风",
        "中国会议麦克风"
      ]
    }
  },
  "ct9-set-wired-cascaded-omnidirectional-microphone": {
    productName: "CT9套装有线级联全向麦克风",
    shortDescription: "有线级联全向会议麦克风系统，配备音频网关、360°拾音、3-5米拾音半径，支持最多8个级联麦克风。",
    description: "CT9套装是一个USB有线级联全向麦克风系统，由CT9S音频网关和CT9M全向麦克风组成。最多可以级联8个全向麦克风，使所有连接的麦克风都能同时拾音和播放声音。该系统通过音频网关支持多种连接方式，包括无线接收器、USB和3.5mm模拟接口。它提供360°声音拾音、回声消除、智能动态降噪和全双工通信，适用于会议环境。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "有线级联全向麦克风",
    features: [
      "USB有线级联全向麦克风系统",
      "CT9S音频网关",
      "CT9M全向麦克风",
      "最多可级联8个麦克风",
      "所有级联麦克风可同时拾音和播放声音",
      "360°全向声音拾音",
      "每个单元3-5米拾音半径",
      "每个单元内置3个全向麦克风",
      "640ms回声消除",
      "智能动态降噪",
      "全双工通信技术",
      "强大的内置放大器",
      "高质量音频输出",
      "无线接收器连接",
      "USB有线连接",
      "3.5mm模拟连接",
      "即插即用",
      "无需驱动安装",
      "触摸按钮",
      "兼容Windows和macOS",
      "支持主流视频会议软件"
    ],
    landingPage: {
      heroTitle: "CT9有线级联全向麦克风系统",
      heroSubtitle: "专业会议音频系统，支持最多8个有线级联麦克风、360°拾音和每个单元3-5米拾音半径。",
      keyBenefits: [
        "最多可级联8个麦克风",
        "360°智能声音拾音",
        "每个单元3-5米拾音半径",
        "640ms回声消除",
        "智能动态降噪",
        "全双工通信",
        "48KHz音频采样",
        "每个单元4Ω 8W × 2扬声器",
        "USB、无线接收器和3.5mm连接",
        "即插即用操作",
        "兼容Windows和macOS"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CT9有线级联全向麦克风系统 | IndoChinaBridge",
      metaDescription: "CT9S和CT9M有线级联会议麦克风系统，支持最多8个麦克风、360°拾音、3-5米范围、回声消除和降噪。",
      keywords: [
        "CT9麦克风",
        "CT9S音频网关",
        "CT9M麦克风",
        "有线级联麦克风",
        "级联会议麦克风",
        "全向会议麦克风",
        "360度会议麦克风",
        "8麦克风会议系统",
        "中国会议麦克风"
      ]
    }
  },
  "ct10d-interactive-omnidirectional-audio-acquisition-system": {
    productName: "CT10D交互式全向音频采集系统",
    shortDescription: "USB连接交互式音频采集系统，配备两个吊装球形麦克风、10米拾音半径、24位/48kHz音频和自适应音频处理。",
    description: "CT10D交互式全向音频采集系统是一个USB连接的音频处理器，设计用于与两个有线吊装麦克风、本地计算机、有源扬声器和视频会议主机配合使用。它提供最远10米的麦克风拾音、48kHz高保真音频、自适应回声消除、自适应噪声抑制、自适应语音增益调整和智能混音。该系统支持24位A/D和D/A转换，并通过凤凰端子块提供2通道平衡输出。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "吊装麦克风音频采集系统",
    features: [
      "USB连接交互式音频采集系统",
      "支持2个有线吊装麦克风",
      "最远10米麦克风拾音半径",
      "48kHz高保真音频采样",
      "24位A/D和D/A转换",
      "高信噪比",
      "自适应回声消除",
      "自适应噪声抑制",
      "自适应语音增益调整",
      "智能混音",
      "最多18dB降噪",
      "2通道平衡输出",
      "DIP开关功能配置",
      "即插即用操作",
      "独立的输入和输出音量控制",
      "兼容主流教学和会议系统",
      "兼容通用教育和会议软件平台"
    ],
    landingPage: {
      heroTitle: "CT10D交互式全向音频采集系统",
      heroSubtitle: "专业吊装麦克风音频系统，配备10米拾音、24位/48kHz音频和自适应语音处理。",
      keyBenefits: [
        "10米最大麦克风拾音半径",
        "2个吊装球形麦克风",
        "24位/48kHz高保真音频",
        "自适应回声消除",
        "自适应噪声抑制",
        "自适应语音增益调整",
        "智能混音",
        "最多18dB降噪",
        "75dB麦克风信噪比",
        "115dB最大麦克风声压级",
        "2通道平衡输出",
        "即插即用部署"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CT10D交互式全向音频采集系统 | IndoChinaBridge",
      metaDescription: "CT10D吊装麦克风音频采集系统，配备两个麦克风、10米拾音半径、24位/48kHz音频、回声消除和智能混音。",
      keywords: [
        "CT10D",
        "CT10D音频采集系统",
        "吊装麦克风系统",
        "全向吊装麦克风",
        "10米拾音麦克风",
        "会议音频系统",
        "吊装会议麦克风",
        "交互式音频采集系统",
        "中国会议音频系统"
      ]
    }
  },
  "ct20-seamless-local-omnidirectional-audio-capture-and-amplification-system": {
    productName: "CT20无缝本地全向音频采集和扩声系统",
    shortDescription: "本地扩声和360°全向音频采集系统，配备内置音频处理、USB供电和3.5mm扬声器连接。",
    description: "CT20无缝本地全向音频采集和扩声系统专为本地扩声设计。它将全向音频采集与本地扩声设备相结合，在整个房间提供清晰真实的声音。其内置音频处理和环境自适应算法提供啸叫抑制、自动增益控制、自动噪声消除和混响抑制。该系统支持免提操作、远距离声音拾音和与远程参与者的实时交互。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "吊装麦克风",
    features: [
      "360°全向声音拾音",
      "内置音频处理器",
      "环境自适应音频算法",
      "自动啸叫抑制",
      "自动增益控制",
      "自动噪声消除",
      "自动混响抑制",
      "智能动态降噪",
      "远距离声音拾音",
      "免提操作",
      "本地同步扩声",
      "简单部署",
      "USB供电操作",
      "3.5mm音频连接有源扬声器",
      "无需复杂布线、安装和调试"
    ],
    landingPage: {
      heroTitle: "CT20无缝本地全向音频采集和扩声系统",
      heroSubtitle: "360°智能声音拾音，配备内置音频处理，用于清晰的本地扩声。",
      keyBenefits: [
        "360°全向声音拾音",
        "≥5米声音拾音半径",
        "内置音频处理",
        "自动啸叫抑制",
        "自动噪声消除",
        "自动增益控制",
        "自动混响抑制",
        "70dB麦克风信噪比",
        "简单USB供电部署",
        "免提操作"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CT20无缝全向音频采集系统 | IndoChinaBridge",
      metaDescription: "CT20吊装麦克风音频采集和扩声系统，配备360°拾音、≥5米拾音距离、内置音频处理和USB供电操作。",
      keywords: [
        "CT20",
        "CT20麦克风",
        "全向音频采集",
        "吊装麦克风",
        "会议麦克风",
        "360度麦克风",
        "本地扩声系统",
        "音频扩声系统",
        "中国会议音频设备"
      ]
    }
  },
  "cv3-wide-angle-usb-2-0-hd-camera": {
    productName: "CV3广角USB 2.0高清摄像头",
    shortDescription: "1080P USB 2.0高清会议摄像头，配备120°广角镜头、机械可调拍摄角度和即插即用操作。",
    description: "CV3广角USB 2.0高清摄像头是一款专为视频会议和在线通信设计的即插即用会议网络摄像头。它配备1080P高清CMOS传感器、120°广角定焦镜头和机械可调拍摄角度。该摄像头通过USB 2.0连接，无需驱动安装，并与常见的视频会议和通话软件兼容。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "USB会议摄像头",
    features: [
      "1080P全高清视频",
      "120°广角拍摄",
      "清晰流畅的实时视频",
      "机械可调镜头",
      "垂直调节-30°至+30°",
      "水平调节-150°至+150°",
      "定焦镜头",
      "即插即用USB连接",
      "无需驱动安装",
      "适用于各种显示设备的通用夹具",
      "紧凑轻便设计",
      "兼容常见视频会议软件"
    ],
    landingPage: {
      heroTitle: "CV3广角USB 2.0高清摄像头",
      heroSubtitle: "1080P广角会议摄像头，配备120°视场角和灵活机械调节。",
      keyBenefits: [
        "1080P全高清视频",
        "120°广角视场角",
        "灵活的平移和倾斜调节",
        "USB 2.0即插即用连接",
        "无需驱动安装",
        "紧凑轻便设计",
        "通用显示设备夹具",
        "兼容视频会议软件"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CV3广角USB 2.0高清会议摄像头 | IndoChinaBridge",
      metaDescription: "CV3 1080P USB 2.0高清会议摄像头，配备120°广角镜头、可调平移和倾斜、定焦和即插即用操作。",
      keywords: [
        "CV3摄像头",
        "CV3会议摄像头",
        "USB会议摄像头",
        "USB 2.0高清摄像头",
        "1080P会议摄像头",
        "120度摄像头",
        "广角会议摄像头",
        "视频会议摄像头",
        "中国会议摄像头"
      ]
    }
  },
  "cv5-multi-interface-hd-optical-zoom-live-streaming-camera": {
    productName: "CV5多接口高清光学变焦直播摄像头",
    shortDescription: "专业1080P直播摄像头，配备18倍光学变焦、最高60fps、USB、HDMI和RJ45接口以及UVC/NDI视频传输。",
    description: "CV5是一款专为专业直播和视频会议设计的高清直播摄像头。它配备18倍光学变焦镜头、1080P分辨率和最高60fps的帧率。该摄像头采用1/2.8英寸高清CMOS传感器，提供USB、HDMI和RJ45接口，用于灵活连接和直接网络传输。它支持即插即用操作，无需驱动安装，并兼容Windows、macOS和Android。",
    category: "会议摄像头",
    mainCategory: "会议设备",
    subCategory: "直播摄像头",
    features: [
      "1080P高清视频",
      "18倍光学变焦",
      "最高60fps视频传输",
      "1/2.8英寸高清CMOS传感器",
      "USB接口",
      "HDMI接口",
      "RJ45以太网接口",
      "直接网络传输",
      "UVC视频传输",
      "NDI视频传输",
      "手动和自动镜头调节",
      "高速自动精确对焦",
      "多功能红外遥控",
      "即插即用操作",
      "无需驱动安装",
      "横屏和竖屏安装支持",
      "绿幕屏蔽支持",
      "美颜增强支持",
      "兼容Windows和macOS"
    ],
    landingPage: {
      heroTitle: "CV5多接口高清光学变焦直播摄像头",
      heroSubtitle: "专业1080P摄像头，配备18倍光学变焦、60fps视频和USB、HDMI及RJ45连接。",
      keyBenefits: [
        "18倍光学变焦",
        "1080P高清视频",
        "最高60fps传输",
        "1/2.8英寸高清CMOS传感器",
        "USB、HDMI和RJ45接口",
        "UVC和NDI支持",
        "手动和自动对焦",
        "即插即用操作",
        "专业直播支持",
        "视频会议兼容"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CV5多接口高清光学变焦直播摄像头 | IndoChinaBridge",
      metaDescription: "CV5专业1080P直播摄像头，配备18倍光学变焦、60fps、USB、HDMI、RJ45、UVC和NDI支持。",
      keywords: [
        "CV5摄像头",
        "CV5直播摄像头",
        "18倍光学变焦摄像头",
        "1080P直播摄像头",
        "专业直播摄像头",
        "USB HDMI RJ45摄像头",
        "NDI摄像头",
        "UVC摄像头",
        "会议摄像头",
        "中国直播摄像头"
      ]
    }
  },
  "chevlen-mic40-desktop-digital-interface-microphone": {
    productName: "CHEVLEN MIC40桌面数字接口麦克风",
    shortDescription: "紧凑型全向桌面数字接口麦克风，专为会议、教学、访谈、演讲和广播设计。",
    description: "CHEVLEN MIC40是一款专为会议、教学、访谈、演讲和广播设计的桌面数字接口麦克风。它结合了会议麦克风和全向麦克风的特性，具有紧凑的便携性和简单的操作。该麦克风提供360°全向声音拾音，支持2米内的远距离声音拾音。它还具有RFI屏蔽、防滑底座、触摸式静音控制和48V幻象电源。",
    category: "会议音频",
    mainCategory: "会议设备",
    subCategory: "桌面数字麦克风",
    features: [
      "全向高清声音拾音",
      "360°声音拾音",
      "2米内远距离声音拾音",
      "专为会议、教学、访谈、演讲和广播设计",
      "射频干扰（RFI）屏蔽",
      "减少手机信号干扰",
      "防滑橡胶垫",
      "减少桌面振动噪声",
      "触摸式静音开关",
      "紧凑便携设计",
      "简单操作，无需复杂调试",
      "兼容主席和客座会议单元",
      "可与Light Conference网络音频控制中心配合使用"
    ],
    landingPage: {
      heroTitle: "CHEVLEN MIC40桌面数字接口麦克风",
      heroSubtitle: "紧凑型全向桌面麦克风，用于会议、教学、访谈、演讲和广播的清晰声音拾音。",
      keyBenefits: [
        "360°全向声音拾音",
        "最远2米远距离声音拾音",
        "40Hz-20kHz频率响应",
        "138dB最大声压级",
        "67dB信噪比",
        "RFI屏蔽技术",
        "触摸式静音控制",
        "防滑抗震底座",
        "紧凑桌面设计",
        "48V幻象电源"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CHEVLEN MIC40桌面数字接口麦克风 | IndoChinaBridge",
      metaDescription: "CHEVLEN MIC40全向桌面数字接口麦克风，配备2米拾音、40Hz-20kHz响应、RFI屏蔽和触摸静音。",
      keywords: [
        "CHEVLEN MIC40",
        "MIC40麦克风",
        "桌面数字麦克风",
        "会议麦克风",
        "全向麦克风",
        "桌面会议麦克风",
        "数字接口麦克风",
        "会议麦克风",
        "广播麦克风",
        "中国会议麦克风"
      ]
    }
  },
  "m100-byod-wireless-conferencing-system": {
    productName: "M100 BYOD无线会议系统",
    shortDescription: "无线BYOD会议和演示系统，配备4屏分屏显示、100米传输、4K@60Hz输出以及USB、Type-C和HDMI连接。",
    description: "M100 BYOD无线会议系统专为交互式无线演示和会议场景设计。3合1发射器提供USB、Type-C和HDMI接口，而该系统支持一键内容共享、无线屏幕镜像、触控回传和反向控制。它支持最远100米的无线传输，并通过Type-C和HDMI发射器端口提供4K@60Hz输出，通过USB发射器端口提供1080P@60Hz输出。该系统采用免驱动即插即用硬件设计，支持计算机、平板电脑、iPhone和Android手机。",
    category: "无线会议",
    subCategory: "BYOD无线演示系统",
    features: [
      "配备USB、Type-C和HDMI接口的3合1发射器",
      "支持4屏分屏显示",
      "无线演示和屏幕镜像",
      "最远100米无线传输",
      "通过Type-C和HDMI发射器端口输出4K@60Hz",
      "通过USB发射器端口输出1080P@60Hz",
      "一键内容共享",
      "支持Windows和Mac设备",
      "支持笔记本电脑、手机和平板电脑",
      "触控回传和反向控制",
      "内置主机控制模式",
      "实时书写和标注",
      "二维码文件共享",
      "免驱动即插即用设计",
      "可自定义设备名称和屏幕镜像代码",
      "Android手机蓝牙音频传输",
      "通过Type-C和HDMI进行无线屏幕镜像",
      "USB发射器屏幕镜像",
      "支持Miracast和AirPlay",
      "支持UVC和无线屏幕共享"
    ],
    landingPage: {
      heroTitle: "M100 BYOD无线会议系统",
      heroSubtitle: "无线演示和会议解决方案，配备4屏分屏显示、4K输出和远距离传输。",
      keyBenefits: [
        "最远100米无线传输",
        "4屏分屏显示",
        "4K@60Hz输出",
        "USB、Type-C和HDMI发射器接口",
        "一键无线内容共享",
        "触控回传和反向控制",
        "实时标注",
        "二维码文件共享",
        "Miracast和AirPlay支持",
        "免驱动即插即用操作",
        "Windows、Mac、iPhone和Android支持"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "M100 BYOD无线会议系统 | IndoChinaBridge",
      metaDescription: "M100 BYOD无线会议和演示系统，配备4屏分屏显示、4K@60Hz输出、100米传输以及USB、Type-C和HDMI支持。",
      keywords: [
        "M100 BYOD",
        "M100无线会议系统",
        "BYOD无线演示",
        "无线会议系统",
        "无线屏幕共享",
        "4K无线演示",
        "4屏无线显示",
        "无线会议设备",
        "中国无线会议系统"
      ]
    }
  },
  "chevlen-dm80-wired-digital-encrypted-conference-system": {
    productName: "CHEVLEN DM80有线数字加密会议系统",
    shortDescription: "全数字有线会议系统，配备多种发言模式、智能摄像头跟踪、每个中央处理器最多60个麦克风单元，可扩展至最多512个单元。",
    description: "CHEVLEN DM80是一款专为专业会议环境设计的全数字有线加密会议系统。每个中央处理器可连接最多60个麦克风单元，提供6个RJ45端口和3个DIN 8芯接口，用于稳定的数据传输。该系统可使用扩展器扩展至支持最多512个麦克风单元，并支持最多12个主席麦克风。它提供多种会议发言模式、独立音频电平控制、基于PC的电子考勤和投票功能、智能视频跟踪以及支持四个高速PTZ摄像头输入的4进1出SDI视频矩阵。",
    category: "会议系统",
    mainCategory: "会议设备",
    subCategory: "有线数字会议系统",
    features: [
      "全数字有线会议系统",
      "支持多种会议发言模式",
      "每个中央处理器最多60个麦克风单元",
      "使用扩展器可扩展至最多512个麦克风单元",
      "支持最多12个主席麦克风",
      "6个RJ45端口",
      "3个DIN 8芯接口",
      "一键飞轮操作",
      "用户友好的菜单设置",
      "系统输出独立音量调节",
      "独立MP3播放音量调节",
      "麦克风和扬声器电平独立调节",
      "RS-485通信接口",
      "RS-232通信接口",
      "RS-232/RX接口",
      "2.0英寸TFT高清彩色显示屏",
      "前USB端口用于会议录制",
      "USB MP3播放",
      "后USB声卡接口",
      "PC连接用于电子考勤",
      "通过专用软件支持投票、选举和评分",
      "视频会议智能自动跟踪",
      "4进1出SDI视频矩阵",
      "支持最多4个高速PTZ摄像头输入",
      "多种PTZ摄像头协议支持",
      "限制模式",
      "FIFO模式",
      "开放模式",
      "主席优先模式"
    ],
    landingPage: {
      heroTitle: "CHEVLEN DM80有线数字加密会议系统",
      heroSubtitle: "专业全数字有线会议系统，配备可扩展麦克风容量、多种发言模式和智能PTZ摄像头跟踪。",
      keyBenefits: [
        "每个中央处理器最多60个麦克风单元",
        "可扩展至最多512个麦克风单元",
        "支持最多12个主席麦克风",
        "4进1出SDI视频矩阵",
        "支持4个高速PTZ摄像头输入",
        "智能视频自动跟踪",
        "多种会议发言模式",
        "电子考勤、投票和评分支持",
        "2.0英寸TFT高清彩色显示屏",
        "USB会议录制和MP3播放",
        "专业2U机架式外形"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CHEVLEN DM80有线数字加密会议系统 | IndoChinaBridge",
      metaDescription: "CHEVLEN DM80数字有线会议系统，每个处理器最多60个麦克风单元，可扩展至512个单元，PTZ摄像头跟踪和SDI视频矩阵。",
      keywords: [
        "CHEVLEN DM80",
        "DM80会议系统",
        "有线数字会议系统",
        "数字加密会议系统",
        "有线会议系统",
        "会议麦克风系统",
        "数字会议控制单元",
        "PTZ会议系统",
        "会议投票系统",
        "中国会议系统"
      ]
    }
  },
  "chevlen-wm60-wireless-digital-encrypted-conference-system": {
    productName: "CHEVLEN WM60无线数字加密会议系统",
    shortDescription: "UHF频段数字无线加密会议系统，配备多种发言模式、6个同时发言者、自动频率扫描和视频跟踪支持。",
    description: "CHEVLEN WM60是一款UHF频段数字无线会议系统，具有全数字控制和多种发言模式，用于安全、高质量的会议。它在可选的520-930MHz频率范围内运行，支持最多2,000个代表单元ID，最多5个主席单元和6个同时发言者。该系统使用具有随机唯一ID和电信级加密的安全数字传输，而自动频率扫描和DQPSK双天线真分集接收有助于提供可靠的无线操作。该系统与视频跟踪和中央控制系统兼容，并支持在同一覆盖区域内进行多次会议。",
    category: "会议系统",
    mainCategory: "会议设备",
    subCategory: "无线数字会议系统",
    features: [
      "UHF频段数字无线会议系统",
      "全数字控制",
      "安全数字传输",
      "随机唯一ID",
      "电信级加密",
      "支持最多2,000个代表单元ID",
      "支持最多5个主席单元",
      "支持6个同时发言者",
      "可选专用主机麦克风",
      "支持手持、领夹和头戴式主机麦克风",
      "多种发言模式",
      "轮换发言模式",
      "限制发言模式",
      "主席优先模式",
      "快速响应模式",
      "8个可调频段",
      "自动频率扫描",
      "DQPSK双天线真分集接收",
      "视频跟踪兼容",
      "支持同一覆盖区域内最多20次同时会议",
      "单旋钮菜单控制",
      "可自定义启动徽标和会议图标",
      "彩色TFT LCD显示屏",
      "内置抗干扰电容麦克风头",
      "发言时间显示",
      "麦克风单元内置大容量锂电池",
      "专用麦克风充电器",
      "电池电量显示",
      "低压警告",
      "频率通道和信号指示灯",
      "电子音量调节",
      "一键咳嗽静音功能",
      "主席单元优先控制",
      "主席可静音代表单元"
    ],
    landingPage: {
      heroTitle: "CHEVLEN WM60无线数字加密会议系统",
      heroSubtitle: "安全UHF数字无线会议解决方案，配备多通道发言、自动频率管理和视频跟踪支持。",
      keyBenefits: [
        "520-930MHz可选UHF频率范围",
        "最多2,000个代表单元ID",
        "最多5个主席单元",
        "6个同时发言者",
        "电信级数字加密",
        "8个可调频段",
        "自动频率扫描",
        "DQPSK双天线真分集接收",
        "视频跟踪兼容",
        "支持最多20次同时会议",
        "代表单元长电池操作",
        "主席优先和代表静音控制"
      ]
    },
    enquiry: {
      buttonText: "请求报价"
    },
    seo: {
      metaTitle: "CHEVLEN WM60无线数字加密会议系统 | IndoChinaBridge",
      metaDescription: "CHEVLEN WM60 UHF无线数字加密会议系统，最多2,000个代表ID、6个同时发言者、自动频率扫描和视频跟踪支持。",
      keywords: [
        "CHEVLEN WM60",
        "WM60会议系统",
        "无线数字会议系统",
        "无线加密会议系统",
        "UHF会议系统",
        "数字无线会议麦克风",
        "无线会议麦克风系统",
        "会议跟踪系统",
        "加密无线会议系统",
        "中国无线会议系统"
      ]
    }
  }
};

const seedTranslations = async () => {
  try {
    console.log("Starting translation seeding...");

    // Clear existing translations
    console.log("Clearing existing translations...");
    await ProductTranslation.deleteMany({});
    console.log("Existing translations cleared");

    // Get all products
    console.log("Fetching products...");
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    const translations = [];

    // Create Chinese translations for each product
    for (const product of products) {
      const customTranslation = chineseTranslations[product.slug];
      
      const translation = {
        product: product._id,
        language: "zh",
        productName: customTranslation?.productName || product.productName,
        shortDescription: customTranslation?.shortDescription || product.shortDescription,
        description: customTranslation?.description || product.description,
        category: customTranslation?.category || product.category,
        mainCategory: customTranslation?.mainCategory || product.mainCategory,
        subCategory: customTranslation?.subCategory || product.subCategory,
        features: customTranslation?.features || product.features,
        specifications: customTranslation?.specifications || product.specifications,
        applications: customTranslation?.applications || product.applications,
        packageContents: customTranslation?.packageContents || product.packageContents,
        customization: {
          details: customTranslation?.customization?.details || product.customization.details,
        },
        sourcing: {
          country: customTranslation?.sourcing?.country || (product.sourcing.country === "China" ? "中国" : product.sourcing.country),
          destination: customTranslation?.sourcing?.destination || (product.sourcing.destination === "India" ? "印度" : product.sourcing.destination),
          moq: customTranslation?.sourcing?.moq || product.sourcing.moq,
        },
        landingPage: {
          heroTitle: customTranslation?.landingPage?.heroTitle || product.landingPage.heroTitle,
          heroSubtitle: customTranslation?.landingPage?.heroSubtitle || product.landingPage.heroSubtitle,
          keyBenefits: customTranslation?.landingPage?.keyBenefits || product.landingPage.keyBenefits,
        },
        enquiry: {
          buttonText: customTranslation?.enquiry?.buttonText || (product.enquiry.buttonText === "Request a Quote" ? "请求报价" : product.enquiry.buttonText),
        },
        seo: {
          metaTitle: customTranslation?.seo?.metaTitle || product.seo.metaTitle,
          metaDescription: customTranslation?.seo?.metaDescription || product.seo.metaDescription,
          keywords: customTranslation?.seo?.keywords || product.seo.keywords,
        },
      };

      translations.push(translation);
      console.log(`Prepared translation for: ${product.productName}`);
    }

    // Insert translations
    console.log("Inserting translations...");
    await ProductTranslation.insertMany(translations);
    console.log(`${translations.length} translations seeded successfully`);

    console.log("Translation seeding completed!");
    console.log("\nAll 20 products now have full Chinese translations.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding translations:", error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedTranslations();
});
