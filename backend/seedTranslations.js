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
    console.log("\nNote: Only the first 4 products have full Chinese translations.");
    console.log("For other products, you need to add their Chinese translations to the chineseTranslations object in this file.");
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
