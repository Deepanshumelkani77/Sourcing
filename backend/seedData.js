const mongoose = require("mongoose");
const Product = require("./models/Product");
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


const products = [

{
  productName: "CV4 4K AI Conference Camera",

  slug: "cv4-4k-ai-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Conference Camera",

  shortDescription:
    "4K conference camera with dual AI-powered microphones, human recognition, beamforming, EPTZ, and 4x electronic zoom for high-quality video conferencing.",

  description:
    "The CV4 is a 4K high-definition conference camera integrated with two audio pickup microphones. It uses facial recognition and human recognition technology to automatically adjust image composition and focus on meeting participants. The dual microphones use AI-powered speech algorithms, noise reduction, and Beam Forming signal processing to capture human voices clearly from up to 3 meters.",

  images: ["https://res.cloudinary.com/drx3wkg1h/image/upload/v1790141610/ChatGPT_Image_Sep_23_2026_11_00_58_AM_wjzpzz.png",
    "https://res.cloudinary.com/drx3wkg1h/image/upload/v1790141611/Gemini_Generated_Image_9bgzr79bgzr79bgz_tnj50y.png",
    "https://res.cloudinary.com/drx3wkg1h/image/upload/v1790141611/Gemini_Generated_Image_9bgzr79bgzr79bgz_1_o9uy6u.png",
    "https://res.cloudinary.com/drx3wkg1h/image/upload/v1790141611/Gemini_Generated_Image_9bgzr79bgzr79bgz_2_dfzvne.png",
    "https://res.cloudinary.com/drx3wkg1h/image/upload/v1790141609/Gemini_Generated_Image_opybujopybujopyb_1_ba5wil.png"
  ],

  features: [
    "Ultra-high-definition 4K video",
    "4K resolution up to 3840 × 2160",
    "4x electronic zoom",
    "Dual built-in microphones",
    "AI-powered microphone noise reduction",
    "Beamforming technology",
    "Human recognition",
    "Facial recognition",
    "Automatic and manual tracking modes",
    "EPTZ (Electronic Pan-Tilt-Zoom)",
    "90° field of view",
    "Fixed-focus lens",
    "Plug-and-play USB connectivity",
    "No driver required",
    "Compatible with Windows and macOS",
    "Infrared remote control",
    "UVC communication protocol"
  ],

  specifications: [
    {
      label: "Product Size",
      value: "104 × 139 × 124 mm"
    },
    {
      label: "Color",
      value: "Business Black"
    },
    {
      label: "Weight",
      value: "768 g (530 g)"
    },
    {
      label: "Connection",
      value: "USB Data Cable"
    },
    {
      label: "Power Supply",
      value: "USB Data Cable, 5V 500mA"
    },
    {
      label: "Operating Temperature",
      value: "-20°C to 70°C"
    },
    {
      label: "Optimal Shooting Temperature",
      value: "0°C to 50°C"
    },
    {
      label: "Supported Operating Systems",
      value: "Windows 7, Windows 8, Windows 10, Mac OS X, Android"
    },
    {
      label: "Microphones",
      value: "2"
    },
    {
      label: "Lens",
      value: "Fixed Focus"
    },
    {
      label: "Imaging Sensor",
      value: "1/2.8-inch"
    },
    {
      label: "Image Sensor Pixels",
      value: "8.3 Megapixels"
    },
    {
      label: "Image Quality",
      value: "4K"
    },
    {
      label: "Maximum Frame Rate",
      value: "MJPEG: 30 FPS; YUV: 30 FPS via USB 3.0"
    },
    {
      label: "Communication Protocol",
      value: "UVC"
    },
    {
      label: "Video Encoding",
      value: "YUV, MJPEG"
    },
    {
      label: "Supported Resolutions",
      value: "3840 × 2160, 2560 × 1440, 1920 × 1080, 1280 × 720"
    },
    {
      label: "Field of View",
      value: "90°"
    },
    {
      label: "Interface",
      value: "USB"
    },
    {
      label: "Microphone Pickup Range",
      value: "Up to 3 meters"
    },
    {
      label: "Electronic Zoom",
      value: "4x"
    }
  ],

  applications: [
    "Video conferencing",
    "Online meetings",
    "Conference rooms",
    "Business meetings",
    "Remote collaboration",
    "Online video calls",
    "Meeting tablets",
    "Desktop computers",
    "Laptops"
  ],

  packageContents: [
    "Camera Host ×1",
    "Remote Control ×1",
    "Instruction Manual ×1"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CV4 4K AI Conference Camera",

    heroSubtitle:
      "Experience intelligent 4K video conferencing with AI-powered voice pickup, human recognition, beamforming, and flexible electronic tracking.",

    keyBenefits: [
      "4K ultra-high-definition video",
      "AI-powered dual microphone noise reduction",
      "Up to 3-meter voice pickup",
      "4x electronic zoom",
      "Human recognition and automatic tracking",
      "90° field of view",
      "Plug-and-play USB connectivity"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle: "CV4 4K AI Conference Camera | IndoChinaBridge",

    metaDescription:
      "CV4 4K AI conference camera with dual microphones, AI noise reduction, beamforming, human recognition, EPTZ, 4x electronic zoom and USB connectivity.",

    keywords: [
      "CV4 conference camera",
      "4K conference camera",
      "AI conference camera",
      "4K video conferencing camera",
      "AI camera with microphone",
      "conference room camera",
      "USB conference camera",
      "China conference camera"
    ]
  },

  status: "active"
},

{
  productName: "4K High-Definition AI Tracking USB Conference Camera Series",

  slug: "4k-ai-tracking-usb-conference-camera-series",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "4K AI tracking PTZ conference camera series with 3x or 10x optical zoom, 4K video output, smooth PTZ control, multiple connectivity options, and up to 255 preset positions.",

  description:
    "The 4K High-Definition AI Tracking USB Conference Camera Series is a PTZ camera solution designed for enterprise, education, remote healthcare, conference rooms, classrooms, training centers, and other professional applications. The camera uses a high-quality 1/2.5-inch CMOS sensor with 8.51 million effective pixels and supports 4K resolution up to 3840 × 2160 at 30fps. It features precise and quiet PTZ positioning, AI intelligent tracking, 3x or 10x optical zoom options, 12x digital zoom, multiple video output options, and up to 255 programmable preset positions.",

  images: [],

  features: [
    "4K ultra-high-definition video",
    "AI intelligent tracking",
    "PTZ pan, tilt and zoom control",
    "3x optical zoom model available",
    "10x optical zoom model available",
    "12x digital zoom",
    "1/2.5-inch CMOS image sensor",
    "8.51 million effective pixels",
    "4KP30 video output",
    "5.8G wireless video transmission",
    "USB 3.0 connectivity",
    "IP network video output",
    "255 preset positions",
    "Smooth and quiet PTZ positioning",
    "2D and 3D digital noise reduction",
    "Low-light imaging support",
    "H.264 and H.265 video compression",
    "UVC support",
    "Remote control",
    "Chinese and English OSD menus",
    "TF card recording",
    "Audio recording support",
    "ONVIF support",
    "SRT support",
    "RTSP support",
    "RTMP support",
    "VISCA protocol support",
    "Pelco-D/Pelco-P protocol support",
    "Optional NDI",
    "Optional POE"
  ],

  specifications: [
    {
      label: "Models",
      value: "4K210U (10x optical zoom USB), 4K210UW (10x optical zoom USB/WIFI), 4K203U (3x optical zoom USB), 4K203UW (3x optical zoom USB/WIFI)"
    },
    {
      label: "Signal System",
      value: "3840 × 2160P30/25, 1080P60/50/30/25, 720P60/50"
    },
    {
      label: "Image Sensor",
      value: "1/2.5-inch high-quality CMOS sensor"
    },
    {
      label: "Effective Pixels",
      value: "8.51 million"
    },
    {
      label: "Digital Zoom",
      value: "12x"
    },
    {
      label: "Optical Zoom",
      value: "3x or 10x depending on model"
    },
    {
      label: "Minimum Illumination",
      value: "0.1 Lux @ F1.6 (Color), 0.01 Lux @ F1.6 (Black and White)"
    },
    {
      label: "Shutter",
      value: "1/30s to 1/10000s"
    },
    {
      label: "White Balance",
      value: "Automatic, Indoor, Outdoor, Manual"
    },
    {
      label: "Backlight Compensation",
      value: "Supported"
    },
    {
      label: "Digital Noise Reduction",
      value: "2D & 3D Digital Noise Reduction"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "≥52 dB"
    },
    {
      label: "3x Lens Field of View",
      value: "105° wide-angle to 35° far end"
    },
    {
      label: "3x Lens Focal Length",
      value: "2.5 mm to 7.5 mm"
    },
    {
      label: "10x Lens Field of View",
      value: "55° wide-angle to 5.5° far end"
    },
    {
      label: "10x Lens Focal Length",
      value: "5.7 mm to 57 mm"
    },
    {
      label: "Horizontal Rotation Range",
      value: "±170°"
    },
    {
      label: "Vertical Rotation Range",
      value: "-30° to +90°"
    },
    {
      label: "Horizontal Rotation Speed",
      value: "1°/s to 100°/s"
    },
    {
      label: "Vertical Rotation Speed",
      value: "1°/s to 60°/s"
    },
    {
      label: "Preset Positions",
      value: "255"
    },
    {
      label: "Preset Position Accuracy",
      value: "±0.1°"
    },
    {
      label: "USB 3.0 Video",
      value: "H.264: 3840 × 2160P30, 2560 × 1440P30, 1920 × 1080P30, 1280 × 720P30, 640 × 480P30, 320 × 240P30"
    },
    {
      label: "MJPEG Resolution",
      value: "3840 × 2160P30, 2560 × 1440P30, 1920 × 1080P30, 1280 × 720P30, 640 × 480P30, 320 × 240P30"
    },
    {
      label: "YUY2 Resolution",
      value: "2560 × 1440P30, 1920 × 1080P30, 1280 × 720P30, 640 × 480P30, 320 × 240P30"
    },
    {
      label: "Video Compression",
      value: "H.265 / H.264"
    },
    {
      label: "Main Stream",
      value: "Up to 4KP30"
    },
    {
      label: "Sub Stream",
      value: "Up to 480P30"
    },
    {
      label: "USB Interface",
      value: "USB 3.0, UVC"
    },
    {
      label: "IP Video Output",
      value: "Up to 4KP30"
    },
    {
      label: "Wireless",
      value: "5.8G wireless transmission"
    },
    {
      label: "USB 2.0",
      value: "Supports connection of devices such as USB omnidirectional microphones"
    },
    {
      label: "TF Card",
      value: "Supports video recording, multiple time-slot recording, and audio recording"
    },
    {
      label: "Communication Interface",
      value: "RS-232 IN, maximum distance 30 m; RS-422, maximum distance 1200 m"
    },
    {
      label: "Communication Protocols",
      value: "VISCA, Pelco-D, Pelco-P"
    },
    {
      label: "Power Input",
      value: "DC 12V"
    },
    {
      label: "Input Voltage",
      value: "AC 110V–AC 220V to DC 12V/1.5A"
    },
    {
      label: "Input Current",
      value: "DC 12V (DC 11.5–DC 12.5V)"
    },
    {
      label: "Operating Temperature",
      value: "0°C to +45°C"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to +60°C"
    },
    {
      label: "Power Consumption",
      value: "12W maximum"
    },
    {
      label: "Package Size",
      value: "355 × 270 × 255 mm"
    },
    {
      label: "Net Weight",
      value: "1.2 kg"
    },
    {
      label: "Gross Weight",
      value: "2 kg"
    }
  ],

  applications: [
    "Conference systems",
    "Enterprise conference rooms",
    "Classrooms",
    "Training centers",
    "Remote healthcare",
    "Remote teaching",
    "Video conferencing",
    "Professional meeting rooms"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "4K AI Tracking USB Conference Camera",

    heroSubtitle:
      "Professional 4K PTZ conference camera with intelligent AI tracking, optical zoom, smooth positioning, and flexible USB, IP and wireless connectivity.",

    keyBenefits: [
      "True 4K ultra-high-definition video",
      "AI intelligent tracking",
      "3x or 10x optical zoom options",
      "12x digital zoom",
      "Smooth and quiet PTZ control",
      "255 programmable preset positions",
      "USB 3.0 4KP30 output",
      "5.8G wireless option",
      "IP network video output",
      "Multiple professional video protocols"
    ],

  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "4K AI Tracking USB Conference Camera | IndoChinaBridge",

    metaDescription:
      "4K AI tracking PTZ conference camera with 3x or 10x optical zoom, 4K video, 255 presets, USB 3.0, IP and 5.8G wireless connectivity.",

    keywords: [
      "4K AI tracking camera",
      "4K PTZ conference camera",
      "AI tracking conference camera",
      "4K USB conference camera",
      "4K PTZ camera",
      "10x optical zoom camera",
      "3x optical zoom camera",
      "AI conference camera",
      "video conferencing PTZ camera",
      "China PTZ camera"
    ]
  },

  status: "active"
},

{
  productName: "CE 4K612 4K Ultra-HD AI Tracking Flagship Conference Camera",

  slug: "ce-4k612-4k-ultra-hd-ai-tracking-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "Professional 4K AI tracking PTZ conference camera with 12x optical zoom, 16x digital zoom, 4K 60fps output, multiple professional interfaces, and advanced human tracking.",

  description:
    "The CE 4K612 is a flagship 4K Ultra-HD AI tracking conference camera equipped with a 12x optical zoom lens and an 80.4° wide-angle field of view. It uses a high-quality 1/2.5-inch SONY CMOS image sensor with 8.29 million effective pixels and supports up to 4K at 60fps. The camera combines advanced ISP processing, autofocus, 3D noise reduction, AI human detection and tracking, multiple video interfaces, professional network protocols, and PTZ control for conference, education, healthcare, broadcasting, government, collaborative office, emergency command, justice, public security, and military applications.",

  images: [],

  features: [
    "4K Ultra-HD video",
    "Up to 4K at 60fps",
    "12x optical zoom",
    "16x digital zoom",
    "80.4° wide-angle field of view",
    "1/2.5-inch SONY CMOS image sensor",
    "8.29 million effective pixels",
    "AI human detection and tracking",
    "Real-time tracking",
    "Area tracking",
    "Up to 4 tracking zones",
    "Fast and accurate autofocus",
    "3D digital noise reduction",
    "Dual-stream output",
    "HDMI 2.0 output",
    "SDI output",
    "USB 2.0 output",
    "LAN network output",
    "POE support",
    "H.264 and H.265 compression",
    "MJPG, H.264, H.265, YUY2 and NV12 USB formats",
    "RTSP support",
    "RTMP support",
    "ONVIF support",
    "GB/T28181 support",
    "VISCA control",
    "PELCO-D control",
    "PELCO-P control",
    "RS232 control",
    "RS422 / RS485 compatible control",
    "Up to 255 preset positions",
    "Remote control",
    "Indoor operation"
  ],

  specifications: [
    {
      label: "Optical Zoom",
      value: "12x"
    },
    {
      label: "Digital Zoom",
      value: "16x"
    },
    {
      label: "Focal Length",
      value: "3.85 mm to 46.2 mm ±5%"
    },
    {
      label: "Horizontal Field of View",
      value: "7.59° narrow angle to 80.4° wide angle"
    },
    {
      label: "Vertical Field of View",
      value: "4.6° narrow angle to 50.0° wide angle"
    },
    {
      label: "Aperture",
      value: "F1.8 to F3.56 ±5%"
    },
    {
      label: "Image Sensor",
      value: "1/2.5-inch SONY CMOS"
    },
    {
      label: "Effective Pixels",
      value: "8.29 million, 16:9"
    },
    {
      label: "Maximum Resolution",
      value: "3840 × 2160"
    },
    {
      label: "Maximum Frame Rate",
      value: "60fps"
    },
    {
      label: "HDMI Output",
      value: "3840 × 2160P60/50/25/59.94/29.97; 1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "SDI Output",
      value: "1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "USB 2.0 Output",
      value: "MJPG, H.264, YUY2 and NV12; supports resolutions up to 3840 × 2160P30 depending on format"
    },
    {
      label: "Minimum Illuminance",
      value: "0.05 Lux (F1.8, AGC ON)"
    },
    {
      label: "Digital Noise Reduction",
      value: "3D Digital Noise Reduction"
    },
    {
      label: "White Balance",
      value: "Automatic, Manual, One-Touch White Balance, Preset Color Temperature"
    },
    {
      label: "Focus Mode",
      value: "Automatic, Manual, One-Click Focus"
    },
    {
      label: "Exposure Mode",
      value: "Automatic, Manual, Shutter Priority, Aperture Priority, Exposure Priority"
    },
    {
      label: "Aperture Range",
      value: "F1.8 to F11, CLOSE"
    },
    {
      label: "Shutter Speed",
      value: "1/25 to 1/10000"
    },
    {
      label: "Backlight Compensation",
      value: "ON/OFF"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "≥50 dB"
    },
    {
      label: "Real-Time Tracking Distance",
      value: "Up to 6 to 7 meters"
    },
    {
      label: "Tracking Speed",
      value: "Supports speaker movement at 1.3 to 1.7 m/s"
    },
    {
      label: "Area Tracking Zones",
      value: "Up to 4 tracking zones"
    },
    {
      label: "Area Tracking Horizontal Range",
      value: "-110° to +110°"
    },
    {
      label: "Area Tracking Vertical Range",
      value: "-27° to +27°"
    },
    {
      label: "Interfaces",
      value: "HDMI, SDI, LAN with POE, USB 2.0, A-IN, RS232 IN, RS232 OUT, RS422 compatible with RS485, rotary DIP, DC12V"
    },
    {
      label: "LAN Video Compression",
      value: "H.264, H.265"
    },
    {
      label: "USB Video Compression",
      value: "MJPG, H.264, H.265, YUY2, NV12"
    },
    {
      label: "Audio Input",
      value: "Dual-channel 3.5mm line input"
    },
    {
      label: "Audio Output",
      value: "HDMI, LAN, SDI, USB 2.0"
    },
    {
      label: "Audio Compression",
      value: "AAC"
    },
    {
      label: "Network Interface",
      value: "10M/100M/1000M adaptive Ethernet, POE supported"
    },
    {
      label: "Network Protocols",
      value: "RTSP, RTMP, ONVIF, GB/T28181, network VISCA control"
    },
    {
      label: "Serial Communication",
      value: "VISCA, Pelco-D, Pelco-P"
    },
    {
      label: "Baud Rates",
      value: "115200, 38400, 9600, 4800, 2400"
    },
    {
      label: "USB Communication",
      value: "UVC video communication protocol, UAC audio communication protocol"
    },
    {
      label: "Power Interface",
      value: "HEC3800 DC 12V"
    },
    {
      label: "Power Adapter",
      value: "AC 110V to AC 220V input; DC 12V/2.5A output"
    },
    {
      label: "Input Voltage",
      value: "DC12V ±10%"
    },
    {
      label: "Input Current",
      value: "<1A"
    },
    {
      label: "Power Consumption",
      value: "<12W"
    },
    {
      label: "Horizontal Rotation",
      value: "-110° to +110°"
    },
    {
      label: "Pitch Rotation",
      value: "-30° to +30° / -27° to +27°"
    },
    {
      label: "Horizontal Control Speed",
      value: "0.1°/s to 100°/s"
    },
    {
      label: "Pitch Control Speed",
      value: "0.1°/s to 70°/s"
    },
    {
      label: "Preset Position Speed",
      value: "Horizontal 78.8°/s, Pitch 31.7°/s"
    },
    {
      label: "Preset Positions",
      value: "Up to 255, including 10 accessible via remote control"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to +60°C"
    },
    {
      label: "Storage Humidity",
      value: "20% to 95%"
    },
    {
      label: "Operating Temperature",
      value: "-10°C to +50°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 80%"
    },
    {
      label: "Dimensions",
      value: "220 × 144 × 159 mm"
    },
    {
      label: "Weight",
      value: "Approximately 1.7 kg"
    },
    {
      label: "Usage Environment",
      value: "Indoor"
    }
  ],

  applications: [
    "Conference systems",
    "Education",
    "Medical care",
    "Government affairs",
    "Cloud video",
    "Collaborative office",
    "Multimedia integration",
    "Emergency command",
    "Broadcasting",
    "Justice",
    "Public security",
    "Military"
  ],

  packageContents: [
    "Power Adapter",
    "RS232 Control Cable",
    "USB 2.0 Connection Cable",
    "Remote Control",
    "Manual",
    "Warranty Card",
    "Certificate of Conformity",
    "Ceiling Mounting Bracket",
    "Wall Mounting Bracket"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE 4K612 4K AI Tracking Conference Camera",

    heroSubtitle:
      "Flagship 4K PTZ conference camera with 12x optical zoom, AI human tracking, 4K 60fps video, professional interfaces and advanced network connectivity.",

    keyBenefits: [
      "4K video up to 60fps",
      "12x optical zoom",
      "16x digital zoom",
      "AI human detection and tracking",
      "Real-time tracking up to 6–7 meters",
      "Up to 255 preset positions",
      "HDMI, SDI, USB and LAN connectivity",
      "POE support",
      "Advanced autofocus",
      "3D digital noise reduction",
      "Professional network and control protocols"
    ],

    sections: [
      {
        title: "Flagship 4K Ultra-HD Imaging",
        description:
          "The CE 4K612 uses a 1/2.5-inch SONY CMOS image sensor with 8.29 million effective pixels and supports 4K video at up to 60fps."
      },
      {
        title: "12x Optical Zoom",
        description:
          "The camera is equipped with a 12x optical zoom lens with an 80.4° wide-angle field of view, providing flexible framing for professional conference environments."
      },
      {
        title: "AI Human Detection and Tracking",
        description:
          "The built-in processor and image analysis algorithms support real-time tracking and area tracking. Real-time tracking can reach 6 to 7 meters, while area tracking supports up to four tracking zones."
      },
      {
        title: "Professional Video Interfaces",
        description:
          "The camera provides HDMI 2.0, SDI, USB 2.0 and LAN interfaces, allowing flexible integration with professional video conferencing, broadcasting and AV systems."
      },
      {
        title: "Advanced Network Connectivity",
        description:
          "The LAN interface supports H.264 and H.265 video compression, POE, RTSP, RTMP, ONVIF and GB/T28181 network protocols, together with network VISCA control."
      },
      {
        title: "Flexible PTZ Control",
        description:
          "The camera supports wide horizontal and vertical movement, variable PTZ control speeds, VISCA, Pelco-D and Pelco-P protocols, and up to 255 preset positions."
      },
      {
        title: "Professional Audio Integration",
        description:
          "The CE 4K612 includes dual-channel 3.5mm line audio input and supports audio output through HDMI, LAN, SDI and USB 2.0."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE 4K612 4K AI Tracking Conference Camera | IndoChinaBridge",

    metaDescription:
      "CE 4K612 flagship 4K AI tracking conference camera with 12x optical zoom, 4K 60fps, AI human tracking, HDMI, SDI, USB, LAN and POE.",

    keywords: [
      "CE 4K612",
      "4K AI tracking camera",
      "4K PTZ conference camera",
      "AI tracking conference camera",
      "12x optical zoom camera",
      "4K 60fps conference camera",
      "4K PTZ camera",
      "AI human tracking camera",
      "professional conference camera",
      "China conference camera"
    ]
  },

  status: "active"
}
,


{
  productName: "CE 4K625 4K Ultra-HD AI Tracking Flagship Conference Camera",

  slug: "ce-4k625-4k-ultra-hd-ai-tracking-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "Professional 4K AI tracking PTZ conference camera with 25x optical zoom, 16x digital zoom, 4K 60fps output, advanced human tracking, and comprehensive professional interfaces.",

  description:
    "The CE 4K625 is a flagship 4K Ultra-HD AI tracking conference camera equipped with a 25x optical zoom lens and a 59.2° wide-angle field of view. It uses a 1/1.8-inch SONY CMOS image sensor with 8.29 million effective pixels and supports 4K video at up to 60fps. The camera combines advanced ISP processing, autofocus, 3D digital noise reduction, AI human detection and tracking, multiple professional video interfaces, network protocols, PTZ control, and up to 255 preset positions.",

  images: [],

  features: [
    "4K Ultra-HD video",
    "Up to 4K at 60fps",
    "25x optical zoom",
    "16x digital zoom",
    "59.2° wide-angle field of view",
    "1/1.8-inch SONY CMOS image sensor",
    "8.29 million effective pixels",
    "AI human detection and tracking",
    "Real-time tracking",
    "Area tracking",
    "Up to 4 tracking zones",
    "Fast and accurate autofocus",
    "3D digital noise reduction",
    "Dual-stream output",
    "HDMI 2.0 output",
    "SDI output",
    "USB 2.0 output",
    "LAN network output",
    "POE support",
    "H.264 and H.265 compression",
    "MJPG, H.264, H.265, YUY2 and NV12 USB formats",
    "RTSP support",
    "RTMP support",
    "ONVIF support",
    "GB/T28181 support",
    "VISCA control",
    "PELCO-D control",
    "PELCO-P control",
    "RS232 control",
    "RS422 / RS485 compatible control",
    "Up to 255 preset positions",
    "Remote control",
    "Indoor operation"
  ],

  specifications: [
    {
      label: "Optical Zoom",
      value: "25x"
    },
    {
      label: "Digital Zoom",
      value: "16x"
    },
    {
      label: "Focal Length",
      value: "7.1 mm to 177.5 mm ±5%"
    },
    {
      label: "Horizontal Field of View",
      value: "2.5° narrow-angle to 59.2° wide-angle"
    },
    {
      label: "Vertical Field of View",
      value: "1.4° narrow-angle to 34.6° wide-angle"
    },
    {
      label: "Aperture",
      value: "F1.61 to F5.19 ±5%"
    },
    {
      label: "Image Sensor",
      value: "1/1.8-inch SONY CMOS"
    },
    {
      label: "Effective Pixels",
      value: "8.29 million, 16:9"
    },
    {
      label: "Maximum Resolution",
      value: "3840 × 2160"
    },
    {
      label: "Maximum Frame Rate",
      value: "60fps"
    },
    {
      label: "HDMI Output",
      value: "3840 × 2160P60/50/25/59.94/29.97; 1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "SDI Output",
      value: "1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "USB 2.0 Output",
      value: "MJPG, H.264, YUY2 and NV12; supports resolutions up to 3840 × 2160P30 depending on format"
    },
    {
      label: "Minimum Illuminance",
      value: "0.05 Lux (F1.8, AGC ON)"
    },
    {
      label: "Digital Noise Reduction",
      value: "3D Digital Noise Reduction"
    },
    {
      label: "White Balance",
      value: "Automatic, Manual, One-Touch White Balance, Preset Color Temperature"
    },
    {
      label: "Focus Mode",
      value: "Automatic, Manual, One-Click Focus"
    },
    {
      label: "Exposure Mode",
      value: "Automatic, Manual, Shutter Priority, Aperture Priority, Exposure Priority"
    },
    {
      label: "Aperture Range",
      value: "F1.8 to F11, CLOSE"
    },
    {
      label: "Shutter Speed",
      value: "1/25 to 1/10000"
    },
    {
      label: "Backlight Compensation",
      value: "ON/OFF"
    },
    {
      label: "Dynamic Range",
      value: "Off / Dynamic Level Adjustment"
    },
    {
      label: "Video Adjustment",
      value: "Brightness, chromaticity, saturation, contrast, sharpness, black and white mode"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "≥50 dB"
    },
    {
      label: "Real-Time Tracking Distance",
      value: "Up to 6 to 7 meters"
    },
    {
      label: "Tracking Speed",
      value: "Supports speaker movement at 1.3 to 1.7 m/s"
    },
    {
      label: "Area Tracking Zones",
      value: "Up to 4 tracking zones"
    },
    {
      label: "Area Tracking Horizontal Range",
      value: "-110° to +110°"
    },
    {
      label: "Area Tracking Vertical Range",
      value: "-27° to +27°"
    },
    {
      label: "Interfaces",
      value: "HDMI, SDI, LAN with POE, USB 2.0, A-IN, RS232 IN, RS232 OUT, RS422 compatible with RS485, rotary DIP, DC12V power supply, power switch"
    },
    {
      label: "LAN Video Compression",
      value: "H.264, H.265"
    },
    {
      label: "USB Video Compression",
      value: "MJPG, H.264, H.265, YUY2, NV12"
    },
    {
      label: "Audio Input",
      value: "Dual-channel 3.5mm line input"
    },
    {
      label: "Audio Output",
      value: "HDMI, LAN, SDI, USB 2.0"
    },
    {
      label: "Audio Compression",
      value: "AAC"
    },
    {
      label: "Network Interface",
      value: "10M/100M/1000M adaptive Ethernet, POE supported"
    },
    {
      label: "Network Protocols",
      value: "RTSP, RTMP, ONVIF, GB/T28181, network VISCA control"
    },
    {
      label: "Serial Communication",
      value: "VISCA, Pelco-D, Pelco-P"
    },
    {
      label: "Baud Rates",
      value: "115200, 38400, 9600, 4800, 2400"
    },
    {
      label: "USB Communication",
      value: "UVC video communication protocol, UAC audio communication protocol"
    },
    {
      label: "Power Interface",
      value: "HEC3800 DC 12V"
    },
    {
      label: "Power Adapter",
      value: "AC 110V to AC 220V input; DC 12V/2.5A output"
    },
    {
      label: "Input Voltage",
      value: "DC12V ±10%"
    },
    {
      label: "Input Current",
      value: "<1A"
    },
    {
      label: "Power Consumption",
      value: "<12W"
    },
    {
      label: "Horizontal Rotation",
      value: "-110° to +110°"
    },
    {
      label: "Pitch Rotation",
      value: "-30° to +30° / -27° to +27°"
    },
    {
      label: "Horizontal Control Speed",
      value: "0.1°/s to 100°/s"
    },
    {
      label: "Pitch Control Speed",
      value: "0.1°/s to 70°/s"
    },
    {
      label: "Preset Position Speed",
      value: "Horizontal 78.8°/s, Pitch 31.7°/s"
    },
    {
      label: "Preset Positions",
      value: "Up to 255, including 10 accessible via remote control"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to +60°C"
    },
    {
      label: "Storage Humidity",
      value: "20% to 95%"
    },
    {
      label: "Operating Temperature",
      value: "-10°C to +50°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 80%"
    },
    {
      label: "Dimensions",
      value: "220 × 144 × 159 mm"
    },
    {
      label: "Weight",
      value: "Approximately 1.7 kg"
    },
    {
      label: "Usage Environment",
      value: "Indoor"
    }
  ],

  applications: [
    "Conference systems",
    "Education",
    "Medical care",
    "Government affairs",
    "Cloud video",
    "Collaborative office",
    "Multimedia integration",
    "Emergency command",
    "Broadcasting",
    "Justice",
    "Public security",
    "Military"
  ],

  packageContents: [
    "Power Adapter",
    "RS232 Control Cable",
    "USB 2.0 Connection Cable",
    "Remote Control",
    "Manual",
    "Warranty Card",
    "Certificate of Conformity",
    "Ceiling Mounting Bracket",
    "Wall Mounting Bracket"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE 4K625 4K AI Tracking Conference Camera",

    heroSubtitle:
      "Flagship 4K PTZ conference camera with 25x optical zoom, AI human tracking, 4K 60fps video, professional interfaces and advanced network connectivity.",

    keyBenefits: [
      "4K video up to 60fps",
      "25x optical zoom",
      "16x digital zoom",
      "AI human detection and tracking",
      "Real-time tracking up to 6–7 meters",
      "Up to 255 preset positions",
      "HDMI, SDI, USB and LAN connectivity",
      "POE support",
      "Advanced autofocus",
      "3D digital noise reduction",
      "Professional network and control protocols"
    ],

    sections: [
      {
        title: "Flagship 4K Ultra-HD Imaging",
        description:
          "The CE 4K625 uses a 1/1.8-inch SONY CMOS image sensor with 8.29 million effective pixels and supports 4K video at up to 60fps."
      },
      {
        title: "25x Optical Zoom",
        description:
          "The camera features a 25x optical zoom lens with a 59.2° wide-angle field of view, providing flexible framing for professional conference and large-room applications."
      },
      {
        title: "AI Human Detection and Tracking",
        description:
          "The built-in processor and image analysis algorithms support real-time tracking and area tracking. Real-time tracking can reach 6 to 7 meters, while area tracking supports up to four tracking zones."
      },
      {
        title: "Professional Video Interfaces",
        description:
          "The camera provides HDMI 2.0, SDI, USB 2.0 and LAN interfaces for integration with professional video conferencing, broadcasting and AV systems."
      },
      {
        title: "Advanced Network Connectivity",
        description:
          "The LAN interface supports H.264 and H.265 video compression, POE, RTSP, RTMP, ONVIF and GB/T28181 network protocols, together with network VISCA control."
      },
      {
        title: "Flexible PTZ Control",
        description:
          "The CE 4K625 supports wide horizontal and vertical movement, variable PTZ control speeds, VISCA, Pelco-D and Pelco-P protocols, and up to 255 preset positions."
      },
      {
        title: "Professional Audio Integration",
        description:
          "The camera includes dual-channel 3.5mm line audio input and supports audio output through HDMI, LAN, SDI and USB 2.0."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE 4K625 4K AI Tracking Conference Camera | IndoChinaBridge",

    metaDescription:
      "CE 4K625 flagship 4K AI tracking conference camera with 25x optical zoom, 4K 60fps, AI human tracking, HDMI, SDI, USB, LAN and POE.",

    keywords: [
      "CE 4K625",
      "4K AI tracking camera",
      "4K PTZ conference camera",
      "AI tracking conference camera",
      "25x optical zoom camera",
      "4K 60fps conference camera",
      "4K PTZ camera",
      "AI human tracking camera",
      "professional conference camera",
      "China conference camera"
    ]
  },

  status: "active"
},


{
  productName: "CE 4K631 4K Ultra-HD AI Tracking Flagship Conference Camera",

  slug: "ce-4k631-4k-ultra-hd-ai-tracking-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "Professional 4K AI tracking PTZ conference camera with 31x optical zoom, 16x digital zoom, 4K 60fps output, advanced human tracking, and comprehensive professional interfaces.",

  description:
    "The CE 4K631 is a flagship 4K Ultra-HD conference camera equipped with a 31x optical zoom lens and a 59° wide-angle field of view. It uses advanced ISP processing technology and image algorithms to provide vivid, high-definition images with strong color reproduction. The camera supports 4K video at up to 60fps, AI human detection and tracking, dual-stream USB output, professional HDMI, SDI, USB and LAN interfaces, multiple network protocols, and up to 255 preset positions.",

  images: [],

  features: [
    "4K Ultra-HD video",
    "Up to 4K at 60fps",
    "31x optical zoom",
    "16x digital zoom",
    "59° wide-angle field of view",
    "1/1.8-inch SONY CMOS image sensor",
    "8.29 million effective pixels",
    "AI human detection and tracking",
    "Real-time tracking",
    "Area tracking",
    "Up to 4 tracking zones",
    "Fast and accurate autofocus",
    "3D digital noise reduction",
    "Dual-stream USB output",
    "HDMI 2.0 output",
    "SDI output",
    "USB 2.0 output",
    "LAN network output",
    "POE support",
    "H.264 and H.265 video compression",
    "MJPG, H.264, H.265, YUY2 and NV12 USB formats",
    "RTSP support",
    "RTMP support",
    "ONVIF support",
    "GB/T28181 support",
    "Network VISCA control",
    "VISCA control",
    "PELCO-D control",
    "PELCO-P control",
    "RS232 control",
    "RS422 compatible with RS485",
    "Up to 255 preset positions",
    "Remote control",
    "Indoor operation"
  ],

  specifications: [
    {
      label: "Optical Zoom",
      value: "31x"
    },
    {
      label: "Digital Zoom",
      value: "16x"
    },
    {
      label: "Focal Length",
      value: "6.91 mm to 214.21 mm ±5%"
    },
    {
      label: "Horizontal Field of View",
      value: "1.98° narrow angle to 59° wide angle"
    },
    {
      label: "Vertical Field of View",
      value: "1.12° narrow angle to 34.14° wide angle"
    },
    {
      label: "Aperture",
      value: "F1.35 to F4.6 ±5%"
    },
    {
      label: "Image Sensor",
      value: "1/1.8-inch SONY CMOS"
    },
    {
      label: "Effective Pixels",
      value: "8.29 million, 16:9"
    },
    {
      label: "Maximum Resolution",
      value: "3840 × 2160"
    },
    {
      label: "Maximum Frame Rate",
      value: "60fps"
    },
    {
      label: "HDMI Output",
      value: "3840×2160P60/50/25/59.94/29.97; 1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "SDI Output",
      value: "1080P60/50/30/25/59.94/29.97; 1080I60/50/59.94; 720P60/50/59.94"
    },
    {
      label: "USB 2.0 Output",
      value: "MJPG, H.264, YUY2 and NV12; up to 3840×2160P30 depending on format"
    },
    {
      label: "Minimum Illuminance",
      value: "0.05 Lux (F1.8, AGC ON)"
    },
    {
      label: "Digital Noise Reduction",
      value: "3D Digital Noise Reduction"
    },
    {
      label: "White Balance",
      value: "Automatic, Manual, One-Touch White Balance, Preset Color Temperature"
    },
    {
      label: "Focus Mode",
      value: "Automatic, Manual, One-Click Focus"
    },
    {
      label: "Exposure Mode",
      value: "Automatic, Manual, Shutter Priority, Aperture Priority, Exposure Priority"
    },
    {
      label: "Aperture Parameter",
      value: "F1.8 to F11, CLOSE"
    },
    {
      label: "Shutter Speed",
      value: "1/25 to 1/10000"
    },
    {
      label: "Backlight Compensation",
      value: "ON/OFF"
    },
    {
      label: "Dynamic Range",
      value: "Off / Dynamic Level Adjustment"
    },
    {
      label: "Video Adjustment",
      value: "Brightness, chromaticity, saturation, contrast, sharpness, black and white mode"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "≥50 dB"
    },
    {
      label: "Real-Time Tracking Distance",
      value: "Up to 6 to 7 meters"
    },
    {
      label: "Tracking Speed",
      value: "Supports speaker movement at 1.3 to 1.7 meters per second"
    },
    {
      label: "Area Tracking Zones",
      value: "Up to 4 tracking zones"
    },
    {
      label: "Area Tracking Horizontal Range",
      value: "-110° to +110°"
    },
    {
      label: "Area Tracking Vertical Range",
      value: "-27° to +27°"
    },
    {
      label: "Interfaces",
      value: "HDMI, SDI, LAN with POE, USB 2.0, A-IN, RS232 IN, RS232 OUT, RS422 compatible with RS485, rotary DIP, DC12V power supply, power switch"
    },
    {
      label: "LAN Video Compression",
      value: "H.264, H.265"
    },
    {
      label: "USB Video Compression",
      value: "MJPG, H.264, H.265, YUY2, NV12"
    },
    {
      label: "Audio Input",
      value: "Dual-channel 3.5mm line input"
    },
    {
      label: "Audio Output",
      value: "HDMI, LAN, SDI, USB 2.0"
    },
    {
      label: "Audio Compression",
      value: "AAC"
    },
    {
      label: "Network Interface",
      value: "10M/100M/1000M adaptive Ethernet, supports POE power supply and audio/video output"
    },
    {
      label: "Network Protocols",
      value: "RTSP, RTMP, ONVIF, GB/T28181, network VISCA control"
    },
    {
      label: "Serial Communication",
      value: "VISCA, Pelco-D, Pelco-P"
    },
    {
      label: "Baud Rates",
      value: "115200, 38400, 9600, 4800, 2400"
    },
    {
      label: "USB Communication",
      value: "UVC video communication protocol, UAC audio communication protocol"
    },
    {
      label: "Power Interface",
      value: "HEC3800 power socket, DC 12V"
    },
    {
      label: "Power Adapter",
      value: "AC 110V to AC 220V input; DC 12V/2.5A output"
    },
    {
      label: "Input Voltage",
      value: "DC12V ±10%"
    },
    {
      label: "Input Current",
      value: "<1A"
    },
    {
      label: "Power Consumption",
      value: "<12W"
    },
    {
      label: "Horizontal Rotation",
      value: "-110° to +110°"
    },
    {
      label: "Pitch Rotation",
      value: "-30° to +30° / -27° to +27°"
    },
    {
      label: "Horizontal Control Speed",
      value: "0.1°/s to 100°/s"
    },
    {
      label: "Pitch Control Speed",
      value: "0.1°/s to 70°/s"
    },
    {
      label: "Preset Position Speed",
      value: "Horizontal 78.8°/s, Pitch 31.7°/s"
    },
    {
      label: "Preset Positions",
      value: "Up to 255, including 10 via remote control"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to +60°C"
    },
    {
      label: "Storage Humidity",
      value: "20% to 95%"
    },
    {
      label: "Operating Temperature",
      value: "-10°C to +50°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 80%"
    },
    {
      label: "Dimensions",
      value: "220 × 144 × 159 mm"
    },
    {
      label: "Weight",
      value: "Approximately 1.7 kg"
    },
    {
      label: "Usage Environment",
      value: "Indoor"
    }
  ],

  applications: [
    "Conferences",
    "Education",
    "Medical care",
    "Government affairs",
    "Cloud video",
    "Collaborative office",
    "Multimedia integration",
    "Emergency command",
    "Broadcasting",
    "Justice",
    "Public security",
    "Military"
  ],

  packageContents: [
    "Power Adapter",
    "RS232 Control Cable",
    "USB 2.0 Connection Cable",
    "Remote Control",
    "Manual",
    "Warranty Card",
    "Certificate of Conformity",
    "Ceiling Mounting Bracket",
    "Wall Mounting Bracket"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE 4K631 4K AI Tracking Conference Camera",

    heroSubtitle:
      "Flagship 4K PTZ conference camera with 31x optical zoom, AI human tracking, 4K 60fps video, professional interfaces and advanced network connectivity.",

    keyBenefits: [
      "4K video up to 60fps",
      "31x optical zoom",
      "16x digital zoom",
      "59° wide-angle field of view",
      "AI human detection and tracking",
      "Real-time tracking up to 6–7 meters",
      "Up to 255 preset positions",
      "HDMI, SDI, USB and LAN connectivity",
      "POE support",
      "Advanced autofocus",
      "3D digital noise reduction",
      "Professional network and control protocols"
    ],

    sections: [
      {
        title: "Flagship 4K Ultra-HD Imaging",
        description:
          "The CE 4K631 uses a 1/1.8-inch SONY CMOS image sensor with 8.29 million effective pixels and supports 4K video at up to 60fps."
      },
      {
        title: "31x Optical Zoom",
        description:
          "The camera features a 31x optical zoom lens with a 59° wide-angle field of view, providing flexible framing for professional conference environments."
      },
      {
        title: "AI Human Detection and Tracking",
        description:
          "The built-in high-speed processor and image processing algorithms support real-time tracking and regional tracking according to the application environment."
      },
      {
        title: "Professional Video Interfaces",
        description:
          "The camera provides HDMI 2.0, SDI, USB 2.0 and LAN interfaces. HDMI, USB and LAN can simultaneously output 4K audio and video."
      },
      {
        title: "Advanced Network Connectivity",
        description:
          "The LAN interface supports H.264 and H.265 video compression, POE, RTSP, RTMP, ONVIF and GB/T28181 network protocols, together with network VISCA control."
      },
      {
        title: "Flexible PTZ Control",
        description:
          "The camera supports wide horizontal and vertical movement, variable PTZ control speeds, VISCA, Pelco-D and Pelco-P protocols, and up to 255 preset positions."
      },
      {
        title: "Professional Audio Integration",
        description:
          "The CE 4K631 provides dual-channel 3.5mm line audio input and supports audio output through HDMI, LAN, SDI and USB 2.0."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE 4K631 4K AI Tracking Conference Camera | IndoChinaBridge",

    metaDescription:
      "CE 4K631 flagship 4K AI tracking conference camera with 31x optical zoom, 4K 60fps, AI human tracking, HDMI, SDI, USB, LAN and POE.",

    keywords: [
      "CE 4K631",
      "4K AI tracking camera",
      "4K PTZ conference camera",
      "AI tracking conference camera",
      "31x optical zoom camera",
      "4K 60fps conference camera",
      "4K PTZ camera",
      "AI human tracking camera",
      "professional conference camera",
      "China conference camera"
    ]
  },

  status: "active"
} ,
{
  productName: "CE 4K210 4K High-Definition AI Tracking HDMI Conference Camera",

  slug: "ce-4k210-4k-high-definition-ai-tracking-hdmi-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "4K AI tracking PTZ conference camera featuring a 10x optical zoom lens, 12x digital zoom, USB 3.0, HDMI and IP video output, smooth PTZ control and multiple network control protocols.",

  description:
    "The CE 4K210 is a 4K high-definition AI tracking HDMI conference camera designed for professional video applications. It uses a 1/2.5-inch Exmor R CMOS sensor with 8.51 million effective pixels and supports high-resolution 3840×2160 video. The camera provides 10x optical zoom, 12x digital zoom, AI target tracking, smooth and quiet PTZ positioning, USB 3.0, HDMI and IP interfaces, TF card local storage, one-click recording, and multiple control and network protocols.",

  images: [],

  features: [
    "4K high-definition video",
    "1/2.5-inch Exmor R CMOS sensor",
    "8.51 million effective pixels",
    "10x optical zoom",
    "12x digital zoom",
    "AI target tracking",
    "Real-time target tracking",
    "Automatic perspective adjustment",
    "Smooth and quiet PTZ positioning",
    "USB 3.0 video output",
    "HDMI video output",
    "IP video output",
    "TF card local storage",
    "One-click recording",
    "256 preset positions",
    "3D noise reduction",
    "Automatic and manual focusing",
    "Backlight compensation",
    "Image flipping",
    "H.264/H.265 encoding",
    "ONVIF support",
    "GB/T28181 support",
    "RTSP support",
    "RTMP support",
    "RTP multicast support",
    "RS232/RS422/RS485 control",
    "USB PTZ control",
    "VISCA protocol",
    "PELCO-D protocol",
    "PELCO-P protocol",
    "Wall-mounted, suspended or tripod installation"
  ],

  specifications: [
    {
      label: "Image Sensor",
      value: "1/2.5-inch high-quality HD CMOS sensor"
    },
    {
      label: "Sensor Type",
      value: "Exmor R CMOS"
    },
    {
      label: "Effective Pixels",
      value: "8.51 million, 16:9 4K"
    },
    {
      label: "Maximum Resolution",
      value: "3840 × 2160"
    },
    {
      label: "Video Formats",
      value: "4Kp30/25, 1080P60/50/30/25, 720P60/50"
    },
    {
      label: "Optical Zoom",
      value: "10x"
    },
    {
      label: "Digital Zoom",
      value: "12x"
    },
    {
      label: "Focal Length",
      value: "f=5.7–57mm"
    },
    {
      label: "Lens Aperture",
      value: "F1.6–F3.5"
    },
    {
      label: "Field of View",
      value: "55° wide-angle end to 5.5° far end"
    },
    {
      label: "Preset Positions",
      value: "256; 10 preset positions available through remote control"
    },
    {
      label: "Video Interfaces",
      value: "USB 3.0 + HDMI + IP"
    },
    {
      label: "AI Tracking",
      value: "Supported"
    },
    {
      label: "Local USB External Expansion",
      value: "Supported"
    },
    {
      label: "One-Click Video Format Switching",
      value: "Supported"
    },
    {
      label: "Minimum Illumination",
      value: "0.1 Lux"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: ">52 dB"
    },
    {
      label: "White Balance",
      value: "Automatic, indoor, outdoor, one-key, manual"
    },
    {
      label: "AE Control",
      value: "Automatic / Manual"
    },
    {
      label: "Image Flip",
      value: "Supported"
    },
    {
      label: "Backlight Compensation",
      value: "Supported"
    },
    {
      label: "Noise Reduction",
      value: "3D NR"
    },
    {
      label: "Focus Mode",
      value: "Automatic / Manual"
    },
    {
      label: "Supported Operating Systems",
      value: "Windows 7, Windows 8, Windows 10, Windows 11"
    },
    {
      label: "PTZ Control",
      value: "IR remote control, RS485, RS422, RS232, USB"
    },
    {
      label: "USB Communication Protocol",
      value: "UVC 1.1"
    },
    {
      label: "Control Protocols",
      value: "VISCA, PELCO-D, PELCO-P"
    },
    {
      label: "Control Interfaces",
      value: "RS-232, RS-422, RS485"
    },
    {
      label: "Baud Rate",
      value: "9600 / 4800 / 2400 bps"
    },
    {
      label: "Control Signal Interface",
      value: "8-core mini DIN"
    },
    {
      label: "Control Signal Format",
      value: "Start bit: 1 bit, Data bit: 8 bits, Stop bit: 1 bit"
    },
    {
      label: "Video Encoding",
      value: "MPEG, YUY2, H.264"
    },
    {
      label: "Pan/Tilt Speed",
      value: "Optional pan tilt speed matching"
    },
    {
      label: "Image Flipping",
      value: "Horizontal and vertical image flipping"
    },
    {
      label: "Installation",
      value: "Wall mounted / suspended / tripod"
    },
    {
      label: "Horizontal Rotation",
      value: "±170°"
    },
    {
      label: "Pitch Rotation",
      value: "-30° to +90°"
    },
    {
      label: "Horizontal Control Speed",
      value: "1–100°/s"
    },
    {
      label: "Pitch Control Speed",
      value: "1–60°/s"
    },
    {
      label: "Preset Speed",
      value: "Horizontal 100°/s, Pitch 60°/s"
    },
    {
      label: "Network Protocols",
      value: "ONVIF, GB/T28181, RTSP, RTMP"
    },
    {
      label: "Streaming",
      value: "RTMP push mode and RTP multicast mode"
    },
    {
      label: "Network Control",
      value: "Network full-command VISCA control"
    },
    {
      label: "Encoding Technology",
      value: "H.264 / H.265"
    },
    {
      label: "Audio Interface",
      value: "3.5mm Line In"
    },
    {
      label: "Audio Encoding",
      value: "AAC, MP3, G711"
    },
    {
      label: "Audio Sampling Frequency",
      value: "8000, 16000, 32000, 44100, 48000 Hz"
    },
    {
      label: "Power Supply",
      value: "AC110V–AC220V to DC12V/2A"
    }
  ],

  applications: [
    "Conference rooms",
    "Video conferencing",
    "Education",
    "Remote communication",
    "Professional video production",
    "Live streaming",
    "Large-scale shooting",
    "Network video applications"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE 4K210 4K AI Tracking HDMI Conference Camera",

    heroSubtitle:
      "Professional 4K PTZ conference camera with 10x optical zoom, AI tracking, USB 3.0, HDMI and IP video output.",

    keyBenefits: [
      "4K high-definition video",
      "10x optical zoom",
      "12x digital zoom",
      "AI real-time tracking",
      "USB 3.0 + HDMI + IP output",
      "Smooth and quiet PTZ movement",
      "256 preset positions",
      "Multiple network protocols",
      "H.264/H.265 encoding",
      "Multiple PTZ control interfaces"
    ],

    sections: [
      {
        title: "True 4K High-Definition Imaging",
        description:
          "The CE 4K210 uses a 1/2.5-inch Exmor R CMOS sensor with 8.51 million effective pixels and supports 3840×2160 resolution."
      },
      {
        title: "10x Optical Zoom",
        description:
          "The camera features a 10x optical zoom lens with a 5.7–57mm focal-length range and a 55° wide-angle field of view."
      },
      {
        title: "AI Target Tracking",
        description:
          "AI tracking provides real-time target tracking and automatic perspective adjustment for professional video applications."
      },
      {
        title: "Smooth PTZ Control",
        description:
          "Advanced motor control algorithms provide precise, smooth and quiet positioning, with horizontal rotation of ±170° and pitch rotation from -30° to +90°."
      },
      {
        title: "Multiple Video Interfaces",
        description:
          "USB 3.0, HDMI and IP interfaces provide flexible video connectivity and support multiple video formats."
      },
      {
        title: "Professional Network and Control",
        description:
          "The camera supports ONVIF, GB/T28181, RTSP and RTMP together with VISCA, PELCO-D and PELCO-P control protocols."
      },
      {
        title: "Local Recording",
        description:
          "The camera supports TF card local storage and one-click recording functionality."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE 4K210 4K AI Tracking HDMI Conference Camera | IndoChinaBridge",

    metaDescription:
      "CE 4K210 4K AI tracking conference camera with 10x optical zoom, 12x digital zoom, USB 3.0, HDMI, IP output and multiple PTZ control protocols.",

    keywords: [
      "CE 4K210",
      "4K conference camera",
      "AI tracking conference camera",
      "4K PTZ camera",
      "AI tracking PTZ camera",
      "10x optical zoom camera",
      "4K HDMI conference camera",
      "4K AI camera",
      "China conference camera",
      "professional PTZ conference camera"
    ]
  },

  status: "active"
},


{
  productName: "CE 4K220S 4K High-Definition AI Tracking Multi-Interface Conference Camera",

  slug: "ce-4k220s-4k-high-definition-ai-tracking-multi-interface-conference-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "4K AI Tracking PTZ Camera",

  shortDescription:
    "4K AI tracking PTZ conference camera with 20x optical zoom, 12x digital zoom, USB 3.0, HDMI, IP and SDI interfaces, smooth PTZ positioning and multiple network control protocols.",

  description:
    "The CE 4K220S is a 4K high-definition AI tracking multi-interface conference camera designed for professional video applications. It uses a 1/2.5-inch Exmor R CMOS sensor with 8.51 million effective pixels and supports 3840×2160 resolution. The camera features 20x optical zoom, 12x digital zoom, AI real-time target tracking, smooth and quiet PTZ control, USB 3.0, HDMI, IP and SDI video interfaces, multiple network protocols, and multiple remote control methods.",

  images: [],

  features: [
    "4K high-definition video",
    "1/2.5-inch Exmor R CMOS sensor",
    "8.51 million effective pixels",
    "20x optical zoom",
    "12x digital zoom",
    "AI real-time target tracking",
    "Automatic perspective adjustment",
    "Precise and quiet PTZ positioning",
    "USB 3.0 video output",
    "HDMI video output",
    "IP video output",
    "SDI video output",
    "Local USB external expansion",
    "One-click video format switching",
    "256 preset positions",
    "3D noise reduction",
    "Automatic and manual focusing",
    "Backlight compensation",
    "Horizontal and vertical image flipping",
    "H.264/H.265 encoding",
    "ONVIF support",
    "GB/T28181 support",
    "RTSP support",
    "RTMP support",
    "RTP multicast support",
    "VISCA control",
    "PELCO-D control",
    "PELCO-P control",
    "RS232/RS422/RS485 control",
    "USB PTZ control",
    "IR remote control",
    "Wall-mounted, suspended or tripod installation"
  ],

  specifications: [
    {
      label: "Image Sensor",
      value: "1/2.5-inch high-quality HD CMOS sensor"
    },
    {
      label: "Sensor Type",
      value: "Exmor R CMOS"
    },
    {
      label: "Effective Pixels",
      value: "8.51 million, 16:9 4K"
    },
    {
      label: "Maximum Resolution",
      value: "3840 × 2160"
    },
    {
      label: "Video Formats",
      value: "4Kp30/25, 1080P60/50/30/25, 720P60/50"
    },
    {
      label: "Optical Zoom",
      value: "20x"
    },
    {
      label: "Digital Zoom",
      value: "12x"
    },
    {
      label: "Focal Length",
      value: "f=5.5–110mm"
    },
    {
      label: "Lens Aperture",
      value: "F1.6–F3.5"
    },
    {
      label: "Field of View",
      value: "58° wide-angle end to 2.9° far end"
    },
    {
      label: "Preset Positions",
      value: "256; 10 preset positions available through remote control"
    },
    {
      label: "Video Interfaces",
      value: "USB 3.0 + HDMI + IP + SDI"
    },
    {
      label: "AI Tracking",
      value: "Supported"
    },
    {
      label: "Local USB External Expansion",
      value: "Supported"
    },
    {
      label: "One-Click Video Format Switching",
      value: "Supported"
    },
    {
      label: "Minimum Illumination",
      value: "0.1 Lux"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: ">52 dB"
    },
    {
      label: "White Balance",
      value: "Automatic / Indoor / Outdoor / One-Key / Manual"
    },
    {
      label: "AE Control",
      value: "Automatic / Manual"
    },
    {
      label: "Image Flip",
      value: "Supported"
    },
    {
      label: "Backlight Compensation",
      value: "Supported"
    },
    {
      label: "Noise Reduction",
      value: "3D NR"
    },
    {
      label: "Focus Mode",
      value: "Automatic / Manual"
    },
    {
      label: "Menu",
      value: "Chinese menu"
    },
    {
      label: "Supported Operating Systems",
      value: "Windows 7, Windows 8, Windows 10, Windows 11"
    },
    {
      label: "PTZ Control",
      value: "IR remote control, RS485, RS422, RS232, USB"
    },
    {
      label: "USB Communication Protocol",
      value: "UVC 1.1"
    },
    {
      label: "Control Protocols",
      value: "VISCA, PELCO-D, PELCO-P"
    },
    {
      label: "Communication Interfaces",
      value: "RS-232, RS-422, RS485"
    },
    {
      label: "Baud Rate",
      value: "9600 / 4800 / 2400 bps"
    },
    {
      label: "Control Signal Interface",
      value: "8-core mini DIN"
    },
    {
      label: "Control Signal Format",
      value: "Start bit: 1 bit, Data bit: 8 bits, Stop bit: 1 bit"
    },
    {
      label: "Video Encoding",
      value: "MPEG, YUY2, H.264"
    },
    {
      label: "Pan/Tilt Speed Matching",
      value: "Supported"
    },
    {
      label: "Installation",
      value: "Wall mounted / suspended / tripod"
    },
    {
      label: "Horizontal Rotation",
      value: "±170°"
    },
    {
      label: "Pitch Rotation",
      value: "-30° to +90°"
    },
    {
      label: "Horizontal Control Speed",
      value: "1–100°/s"
    },
    {
      label: "Pitch Control Speed",
      value: "1–60°/s"
    },
    {
      label: "Preset Speed",
      value: "Horizontal 100°/s, Pitch 60°/s"
    },
    {
      label: "Network Protocols",
      value: "ONVIF, GB/T28181, RTSP, RTMP"
    },
    {
      label: "Streaming",
      value: "RTMP push mode and RTP multicast mode"
    },
    {
      label: "Network Control",
      value: "Network full-command VISCA control"
    },
    {
      label: "Encoding Technology",
      value: "H.264 / H.265"
    },
    {
      label: "Audio Interface",
      value: "3.5mm Line In"
    },
    {
      label: "Audio Encoding",
      value: "AAC, MP3, G711"
    },
    {
      label: "Audio Sampling Frequency",
      value: "8000, 16000, 32000, 44100, 48000 Hz"
    },
    {
      label: "Power Supply",
      value: "AC110V–AC220V to DC12V/2A"
    }
  ],

  applications: [
    "Video conferencing",
    "Conference rooms",
    "Education",
    "Professional video production",
    "Live streaming",
    "Large-scale shooting",
    "Remote communication",
    "Network video applications"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE 4K220S 4K AI Tracking Multi-Interface Conference Camera",

    heroSubtitle:
      "Professional 4K PTZ conference camera with 20x optical zoom, AI tracking, USB 3.0, HDMI, IP and SDI video interfaces.",

    keyBenefits: [
      "4K high-definition video",
      "20x optical zoom",
      "12x digital zoom",
      "AI real-time target tracking",
      "USB 3.0 + HDMI + IP + SDI output",
      "Smooth and quiet PTZ positioning",
      "256 preset positions",
      "Multiple network protocols",
      "H.264/H.265 encoding",
      "Multiple PTZ control interfaces"
    ],

    sections: [
      {
        title: "True 4K High-Definition Imaging",
        description:
          "The CE 4K220S uses a 1/2.5-inch Exmor R CMOS sensor with 8.51 million effective pixels and supports 3840×2160 video."
      },
      {
        title: "20x Optical Zoom",
        description:
          "The camera features a 20x optical zoom lens with a 5.5–110mm focal-length range and a 58° wide-angle field of view."
      },
      {
        title: "AI Target Tracking",
        description:
          "AI tracking enables real-time target tracking and automatic perspective adjustment for professional video applications."
      },
      {
        title: "Multi-Interface Video Output",
        description:
          "USB 3.0, HDMI, IP and SDI interfaces provide flexible connectivity for professional video systems."
      },
      {
        title: "Smooth PTZ Control",
        description:
          "Advanced motor control algorithms provide precise, smooth and quiet positioning, with ±170° horizontal rotation and -30° to +90° pitch rotation."
      },
      {
        title: "Professional Network Connectivity",
        description:
          "The camera supports ONVIF, GB/T28181, RTSP and RTMP protocols, including RTMP push, RTP multicast and network VISCA control."
      },
      {
        title: "Flexible Installation",
        description:
          "The CE 4K220S supports wall-mounted, suspended and tripod installation."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE 4K220S 4K AI Tracking Multi-Interface Conference Camera | IndoChinaBridge",

    metaDescription:
      "CE 4K220S 4K AI tracking conference camera with 20x optical zoom, 12x digital zoom, USB 3.0, HDMI, IP and SDI interfaces.",

    keywords: [
      "CE 4K220S",
      "4K conference camera",
      "AI tracking conference camera",
      "4K PTZ camera",
      "AI tracking PTZ camera",
      "20x optical zoom camera",
      "4K HDMI SDI camera",
      "4K AI camera",
      "multi-interface conference camera",
      "China conference camera"
    ]
  },

  status: "active"
},


{
  productName: "CE G200 Binocular Intelligent Voice Tracking Conference PTZ Camera",

  slug: "ce-g200-binocular-intelligent-voice-tracking-conference-ptz-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "AI Voice Tracking PTZ Camera",

  shortDescription:
    "Binocular intelligent voice-tracking conference PTZ camera with dual-lens close-up and panoramic imaging, 12x optical zoom, AI speaker tracking and automatic scene switching.",

  description:
    "The CE G200 is a binocular intelligent voice-tracking conference PTZ camera integrating voice localization technology with AI human detection and recognition algorithms. It automatically identifies speakers, frames them with an optimal view and dynamically adjusts framing according to participant movement and headcount changes. Its dual-lens design captures close-up and panoramic footage simultaneously and enables intelligent automatic scene switching. The system also supports multiple speaker tracking modes and can intelligently detect writing on whiteboards and automatically zoom in for close-up viewing.",

  images: [],

  features: [
    "Binocular dual-lens camera design",
    "Voice localization technology",
    "AI human detection and recognition",
    "Automatic speaker framing",
    "Dynamic framing adjustment",
    "Automatic scene switching",
    "Multiple speaker tracking modes",
    "Whiteboard writing detection",
    "Automatic whiteboard close-up",
    "Fully automatic operation",
    "Up to 8-meter effective tracking depth",
    "12x optical zoom PTZ camera",
    "16x digital zoom",
    "72.5° maximum horizontal FOV on close-up camera",
    "110° horizontal FOV panoramic camera",
    "Simultaneous HDMI, USB 3.0, 3G-SDI and Ethernet output",
    "1080P up to 60fps",
    "Built-in USB HOST port for external microphones",
    "POE network support",
    "Three-stream support",
    "VISCA control",
    "Infrared remote control"
  ],

  specifications: [
    {
      label: "Model",
      value: "CE G200"
    },
    {
      label: "Camera Type",
      value: "Binocular intelligent voice tracking conference PTZ camera"
    },
    {
      label: "Close-Up Camera Sensor",
      value: "1/2.8-inch CMOS, 2.14 million pixels"
    },
    {
      label: "Close-Up Camera Focal Length",
      value: "f=4.1mm–49.2mm"
    },
    {
      label: "Close-Up Camera Iris",
      value: "F1.6–F2.8"
    },
    {
      label: "Optical Zoom",
      value: "12x"
    },
    {
      label: "Digital Zoom",
      value: "16x"
    },
    {
      label: "Close-Up Horizontal Viewing Angle",
      value: "72.5°–6.3°"
    },
    {
      label: "Close-Up Lens System",
      value: "Automatic, Manual, One-Touch Trigger, PTZ Trigger"
    },
    {
      label: "Shutter Speed",
      value: "1/50–1/10,000 sec."
    },
    {
      label: "Transmission Gain",
      value: "Automatic / Manual"
    },
    {
      label: "Close-Up White Balance",
      value: "Automatic, One-click trigger, Manual, Static color temperature"
    },
    {
      label: "Exposure Control",
      value: "Automatic, Manual, Shutter Priority, Aperture Priority, Brightness Priority"
    },
    {
      label: "Menu Languages",
      value: "English and Chinese"
    },
    {
      label: "Panoramic Camera Sensor",
      value: "1/2.8-inch CMOS, 2.14 million pixels"
    },
    {
      label: "Panoramic Camera Focal Length",
      value: "f=1.89mm"
    },
    {
      label: "Panoramic Horizontal Viewing Angle",
      value: "110°"
    },
    {
      label: "Panoramic White Balance",
      value: "Automatic"
    },
    {
      label: "Panoramic Exposure Control",
      value: "Automatic"
    },
    {
      label: "Horizontal PTZ Range",
      value: "-130° to +130°"
    },
    {
      label: "Vertical PTZ Range",
      value: "-30° to +90°"
    },
    {
      label: "Horizontal Rotation Speed",
      value: "0.2°/s to 90°/s"
    },
    {
      label: "Vertical Rotation Speed",
      value: "0.2°/s to 60°/s"
    },
    {
      label: "Preset Positions",
      value: "64"
    },
    {
      label: "HDMI",
      value: "1 port; 1080P60/P50/P30/P25 and 720P60/P50; supports audio and video"
    },
    {
      label: "3G-SDI",
      value: "1 port; 1080P60/P50/P30/P25 and 720P60/P50"
    },
    {
      label: "USB 3.0",
      value: "1 × USB 3.0 Type-B"
    },
    {
      label: "USB 3.0 Protocol",
      value: "UVC 1.1"
    },
    {
      label: "USB 3.0 YUY2/NV12 Resolution",
      value: "1080P30/P25, 720P30/P25, 480P30/P25"
    },
    {
      label: "USB 3.0 H.264/H.265/MJPEG Resolution",
      value: "1080P60/P50/P30/P25, 720P60/P50/P30/P25, 360P60/P50/P30/P25"
    },
    {
      label: "USB 2.0",
      value: "1 × USB 2.0 Type-A HOST"
    },
    {
      label: "Network",
      value: "1 × 10/100M RJ-45 with POE"
    },
    {
      label: "Network Video Resolution",
      value: "1080P30/P25, 720P30/P25, 360P30/P25"
    },
    {
      label: "Network Video Formats",
      value: "H.264, H.265"
    },
    {
      label: "Audio Compression",
      value: "AAC"
    },
    {
      label: "Network Protocols",
      value: "ONVIF, RTSP, TCP, UDP, RTMP"
    },
    {
      label: "Multi-Streaming",
      value: "One close-up stream, one panoramic stream and one switching stream"
    },
    {
      label: "Audio Input",
      value: "3.5mm LINE IN"
    },
    {
      label: "Reference Audio",
      value: "3.5mm REF interface"
    },
    {
      label: "Control Interface",
      value: "RS-485"
    },
    {
      label: "Serial Control",
      value: "RS-232 IN"
    },
    {
      label: "Control Protocol",
      value: "VISCA"
    },
    {
      label: "Wireless Control",
      value: "Infrared remote control"
    },
    {
      label: "Power Interface",
      value: "DC12V"
    },
    {
      label: "Power Consumption",
      value: "<20W"
    },
    {
      label: "Operating Temperature",
      value: "0°C to 40°C"
    },
    {
      label: "Operating Humidity",
      value: "10% RH to 90% RH"
    },
    {
      label: "Storage Temperature",
      value: "-20°C to +60°C"
    },
    {
      label: "Storage Humidity",
      value: "10% RH to 95% RH"
    },
    {
      label: "Dimensions",
      value: "245 × 145 × 164mm"
    },
    {
      label: "Body Weight",
      value: "≤2kg"
    },
    {
      label: "Body Color",
      value: "Starlight Gray"
    }
  ],

  applications: [
    "Medium-sized meeting rooms",
    "Classrooms",
    "Auditoriums",
    "Video conferences",
    "Cloud conferences",
    "Professional meeting environments"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE G200 Intelligent Voice Tracking Conference PTZ Camera",

    heroSubtitle:
      "Binocular AI conference camera with voice localization, automatic speaker tracking, dual-lens panoramic and close-up imaging, and 12x optical zoom.",

    keyBenefits: [
      "Intelligent voice localization",
      "AI human detection and recognition",
      "Automatic speaker framing",
      "Dual-lens close-up and panoramic imaging",
      "12x optical zoom",
      "16x digital zoom",
      "Up to 8m tracking depth",
      "110° panoramic field of view",
      "1080P up to 60fps",
      "HDMI + USB 3.0 + 3G-SDI + Ethernet",
      "POE network support",
      "Three-stream output",
      "Automatic whiteboard detection",
      "VISCA control"
    ],

    sections: [
      {
        title: "Intelligent Voice Tracking",
        description:
          "The CE G200 combines voice localization with AI human detection and recognition to accurately identify speakers and automatically frame them."
      },
      {
        title: "Binocular Dual-Lens Design",
        description:
          "The close-up and panoramic cameras capture different views simultaneously, enabling intelligent automatic switching between scenes."
      },
      {
        title: "Automatic Speaker Framing",
        description:
          "The system dynamically adjusts framing according to participant movement and changes in the number of participants."
      },
      {
        title: "Intelligent Whiteboard Tracking",
        description:
          "The camera can detect writing on a whiteboard and automatically zoom in to provide a clear close-up view of the written content."
      },
      {
        title: "Close-Up PTZ Camera",
        description:
          "The close-up camera provides 12x optical zoom, 16x digital zoom and a maximum horizontal field of view of 72.5°."
      },
      {
        title: "Wide-Angle Panoramic Camera",
        description:
          "The dedicated panoramic camera provides a 110° horizontal field of view for wider room coverage."
      },
      {
        title: "Professional Connectivity",
        description:
          "The CE G200 supports simultaneous HDMI, USB 3.0, 3G-SDI and Ethernet video output, along with USB HOST connectivity for external microphones."
      },
      {
        title: "Three-Stream Network Output",
        description:
          "Network streaming can provide one close-up stream, one panoramic stream and one switching stream."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE G200 AI Voice Tracking Conference PTZ Camera | IndoChinaBridge",

    metaDescription:
      "CE G200 binocular AI voice tracking conference PTZ camera with 12x optical zoom, dual-lens panoramic imaging, automatic speaker tracking, HDMI, USB 3.0 and 3G-SDI.",

    keywords: [
      "CE G200",
      "G200 conference camera",
      "AI voice tracking camera",
      "voice tracking conference camera",
      "intelligent conference PTZ camera",
      "binocular conference camera",
      "AI speaker tracking camera",
      "12x optical zoom conference camera",
      "3G-SDI conference camera",
      "China conference camera"
    ]
  },

  status: "active"
}   ,



{
  productName: "CE G400 Four-Eye Intelligent Voice Tracking Camera System",

  slug: "ce-g400-four-eye-intelligent-voice-tracking-camera-system",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "Intelligent Voice Tracking Camera System",

  shortDescription:
    "Four-eye intelligent voice tracking camera system with audio positioning, body detection, intelligent video analysis, automatic speaker framing and seamless switching between close-up and wide-angle views.",

  description:
    "The CE G400 Four-Eye Intelligent Voice Tracking Camera System combines audio positioning with intelligent video analysis to provide an automated meeting experience. It can precisely frame speakers using audio positioning, body detection and recognition technologies, and automatically switch between close-up and wide-angle views to capture the whole meeting. The system is designed to minimize manual camera operation so meeting participants can focus on discussion.",

  images: [],

  features: [
    "Four-eye intelligent voice tracking camera system",
    "Audio positioning technology",
    "Intelligent video analysis",
    "Body detection and recognition",
    "Automatic speaker framing",
    "Automatic switching between close-up and wide-angle views",
    "Seamless switching between various scenes",
    "1/2.8-inch Exmor CMOS sensor",
    "2.14MP imaging",
    "12x optical zoom",
    "12x digital zoom",
    "72.5° maximum field of view",
    "Simultaneous 3G-SDI, HDMI and Ethernet output",
    "Up to 1080p60 resolution",
    "H.264/H.265 video compression",
    "Dual-stream support"
  ],

  specifications: [
    {
      label: "Model",
      value: "CE G400"
    },
    {
      label: "Camera System",
      value: "Four-Eye Intelligent Voice Tracking Camera System"
    },
    {
      label: "Image Sensor",
      value: "1/2.8-inch Exmor CMOS, 2.14MP"
    },
    {
      label: "Signal Format (SDI)",
      value: "1080p/60, 1080p/50, 1080p/30, 1080p/25, 1080i/60, 1080i/50, 720p/60, 720p/50"
    },
    {
      label: "Focal Length",
      value: "f=3.9mm–46.8mm"
    },
    {
      label: "Iris",
      value: "F1.6–F2.8"
    },
    {
      label: "Optical Zoom",
      value: "12x"
    },
    {
      label: "Digital Zoom",
      value: "12x"
    },
    {
      label: "Field of View",
      value: "72.5°–6.3°"
    },
    {
      label: "Focus",
      value: "Auto, Manual, PTZ Push, One Push"
    },
    {
      label: "Minimum Illumination",
      value: "0.5 Lux (color)"
    },
    {
      label: "Shutter Speed",
      value: "1/25–1/10,000s"
    },
    {
      label: "AGC",
      value: "Auto, Manual"
    },
    {
      label: "White Balance",
      value: "Auto, Indoor, Outdoor, One Push, Auto Track"
    },
    {
      label: "Exposure",
      value: "Auto, Manual, Shutter Priority, Iris Priority"
    },
    {
      label: "S/N Ratio",
      value: "≥50dB"
    },
    {
      label: "Digital Noise Reduction",
      value: "2D/3D DNR"
    },
    {
      label: "Backlight Compensation",
      value: "Yes"
    },
    {
      label: "Pan Range",
      value: "-90° to +90°"
    },
    {
      label: "Tilt Range",
      value: "-30° to +90°"
    },
    {
      label: "Pan Speed",
      value: "0.1°/s to 120°/s"
    },
    {
      label: "Tilt Speed",
      value: "0.1°/s to 80°/s"
    },
    {
      label: "Preset Number",
      value: "256"
    },
    {
      label: "OSD",
      value: "Yes"
    },
    {
      label: "Image Flip",
      value: "Yes"
    },
    {
      label: "Maximum Network Image Size",
      value: "1920×1080 @60fps"
    },
    {
      label: "Video Compression",
      value: "H.265, H.264"
    },
    {
      label: "Audio Compression",
      value: "AAC"
    },
    {
      label: "Network Protocols",
      value: "HTTP, RTSP, RTMP, RTP, TCP, UDP, ONVIF"
    },
    {
      label: "Dual Stream",
      value: "Yes"
    },
    {
      label: "Video Output",
      value: "1×HDMI, 1×3G-SDI"
    },
    {
      label: "Audio Input",
      value: "2×LINE IN, including one channel with EC"
    },
    {
      label: "Audio Output",
      value: "1×LINE OUT"
    },
    {
      label: "Network Interface",
      value: "1×10M/100M"
    },
    {
      label: "USB Interface",
      value: "1×USB2.0"
    },
    {
      label: "Control Interface",
      value: "1×RS-232"
    },
    {
      label: "Control Protocol",
      value: "VISCA, PELCO-P, PELCO-D"
    },
    {
      label: "Address",
      value: "0–63"
    },
    {
      label: "Power Supply",
      value: "DC 12V"
    },
    {
      label: "Power Consumption",
      value: "<24W"
    },
    {
      label: "Working Temperature",
      value: "0°C to +40°C"
    },
    {
      label: "Storage Temperature",
      value: "-20°C to +60°C"
    },
    {
      label: "Dimensions",
      value: "500mm × 163mm × 145mm"
    },
    {
      label: "Weight",
      value: "3kg"
    }
  ],

  applications: [
    "Conference rooms",
    "Intelligent meeting environments",
    "Professional video conferencing"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CE G400 Four-Eye Intelligent Voice Tracking Camera System",

    heroSubtitle:
      "Intelligent conference camera system combining audio positioning, speaker recognition and automatic close-up and wide-angle scene switching.",

    keyBenefits: [
      "Intelligent audio positioning",
      "Body detection and recognition",
      "Precise automatic speaker framing",
      "Automatic close-up and wide-angle switching",
      "12x optical zoom",
      "12x digital zoom",
      "72.5° maximum FOV",
      "1080p60 video output",
      "H.264/H.265 video compression",
      "3G-SDI, HDMI and Ethernet connectivity",
      "256 camera presets",
      "Dual-stream network output"
    ],

    sections: [
      {
        title: "Intelligent Speaker Tracking",
        description:
          "The CE G400 combines audio positioning with body detection and recognition technologies to precisely frame speakers."
      },
      {
        title: "Automatic Scene Switching",
        description:
          "The system automatically switches between close-up and wide-angle images to capture individual speakers as well as the whole meeting."
      },
      {
        title: "High-Definition Imaging",
        description:
          "The HD camera uses a 1/2.8-inch Exmor CMOS sensor with 2.14MP resolution, 12x optical zoom and a maximum 72.5° field of view."
      },
      {
        title: "Professional Video Output",
        description:
          "The camera supports 3G-SDI, HDMI and Ethernet output with video resolutions up to 1080p60."
      },
      {
        title: "Network Streaming",
        description:
          "The system supports H.264/H.265 compression, AAC audio compression, dual streaming and multiple network protocols including ONVIF, RTSP and RTMP."
      },
      {
        title: "PTZ Control",
        description:
          "The PTZ mechanism provides a -90° to +90° pan range, -30° to +90° tilt range and up to 256 preset positions."
      }
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CE G400 Four-Eye Intelligent Voice Tracking Camera | IndoChinaBridge",

    metaDescription:
      "CE G400 intelligent voice tracking conference camera system with audio positioning, automatic speaker framing, 12x optical zoom, 1080p60 and 3G-SDI, HDMI and Ethernet output.",

    keywords: [
      "CE G400",
      "CE G400 camera",
      "four-eye conference camera",
      "intelligent voice tracking camera",
      "voice tracking conference camera",
      "AI conference camera",
      "speaker tracking camera",
      "12x optical zoom camera",
      "3G-SDI conference camera",
      "China conference camera"
    ]
  },

  status: "active"
},

{
  productName: "CHEVLEN MIC30 Ceiling-Mount Microphone",

  slug: "chevlen-mic30-ceiling-mount-microphone",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Ceiling-Mounted Microphone",

  shortDescription:
    "Ceiling-mounted microphone with 5–8m long-distance pickup, supercardioid unidirectional directivity and high speech clarity for conference environments.",

  description:
    "The CHEVLEN MIC30 is a ceiling-mount microphone designed for long-distance voice pickup in conference and professional audio environments. It provides 5–8m pickup capability, high sensitivity and strong directionality to improve speech clarity and signal-to-noise performance. Its sector-shaped pickup pattern captures human voice signals across a wide area, while the ceiling-mounted design integrates with architectural surroundings.",

  images: [],

  features: [
    "Ceiling-mounted microphone design",
    "5–8m long-distance pickup",
    "Microphone head extends 75°",
    "Microphone head rotates 360°",
    "Blue indicator ring for microphone on/off status",
    "High sensitivity",
    "Strong directionality",
    "Sector-shaped pickup pattern",
    "Supercardioid unidirectional directivity",
    "Designed for acoustically challenging environments",
    "Architecturally integrated ceiling-mounted design",
    "Balanced microphone output",
    "Phantom power operation"
  ],

  specifications: [
    {
      label: "Microphone Type",
      value: "Ceiling-Mount Microphone"
    },
    {
      label: "Directivity",
      value: "Supercardioid, unidirectional"
    },
    {
      label: "Pickup Distance",
      value: "5–8m"
    },
    {
      label: "Frequency Response",
      value: "40Hz–18kHz"
    },
    {
      label: "Sensitivity",
      value: "-40dB (7.9mV) re 1V at 1Pa"
    },
    {
      label: "Impedance",
      value: "200Ω"
    },
    {
      label: "Maximum SPL",
      value: "125dB at 1kHz (1% THD)"
    },
    {
      label: "Dynamic Range",
      value: "100dB at 1kHz (Max SPL)"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "70dB at 1kHz/1Pa"
    },
    {
      label: "Phantom Power",
      value: "11–52V"
    },
    {
      label: "Microphone Directivity",
      value: "≥160° conical dispersion pattern relative to vertical axis"
    },
    {
      label: "Weight",
      value: "210g"
    },
    {
      label: "Cutout Size",
      value: "φ75–80mm"
    },
    {
      label: "Output Interface",
      value: "Bare wire; standard SPL-3 quick-connect terminal included"
    },
    {
      label: "Microphone Head Extension",
      value: "75°"
    },
    {
      label: "Microphone Head Rotation",
      value: "360°"
    }
  ],

  applications: [
    "Conference rooms",
    "Professional meeting environments",
    "Ceiling-mounted audio systems",
    "Conference audio systems"
  ],

  packageContents: [
    "SPL-3 quick-connect terminal"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CHEVLEN MIC30 Ceiling-Mount Microphone",

    heroSubtitle:
      "Long-distance ceiling-mounted conference microphone with 5–8m pickup, supercardioid directionality and clear speech capture.",

    keyBenefits: [
      "5–8m long-distance pickup",
      "Supercardioid unidirectional pickup",
      "40Hz–18kHz frequency response",
      "70dB signal-to-noise ratio",
      "125dB maximum SPL",
      "11–52V phantom power",
      "360° microphone head rotation",
      "75° microphone head extension",
      "Ceiling-mounted architectural design",
      "SPL-3 quick-connect terminal included"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CHEVLEN MIC30 Ceiling-Mount Microphone | IndoChinaBridge",

    metaDescription:
      "CHEVLEN MIC30 ceiling-mount conference microphone with 5–8m pickup, supercardioid directionality, 70dB SNR and 11–52V phantom power.",

    keywords: [
      "CHEVLEN MIC30",
      "MIC30 ceiling microphone",
      "ceiling mount microphone",
      "ceiling conference microphone",
      "conference room microphone",
      "long distance microphone",
      "5-8m pickup microphone",
      "supercardioid microphone",
      "China conference microphone"
    ]
  },

  status: "active"
},

{
  productName: "CT3 Bluetooth Cascade Omnidirectional Microphone",

  slug: "ct3-bluetooth-cascade-omnidirectional-microphone",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Bluetooth Cascade Omnidirectional Microphone",

  shortDescription:
    "Portable USB and Bluetooth omnidirectional conference microphone with 3–5m pickup radius, 360° audio pickup, wireless cascading and built-in speaker.",

  description:
    "The CT3 is a portable USB and Bluetooth omnidirectional conference microphone designed for meetings and video conferencing. It provides 360° sound pickup with a 3–5 meter pickup radius and supports wireless cascading of two devices so both microphones can receive and play sound simultaneously. The microphone supports USB and Bluetooth connectivity, intelligent dynamic noise reduction, 384ms echo cancellation and full-duplex communication. It also includes a built-in high-performance speaker for audio playback.",

  images: [],

  features: [
    "USB and Bluetooth connectivity",
    "Wireless cascading of up to 2 devices",
    "360° omnidirectional sound pickup",
    "3–5m pickup radius",
    "Built-in 4 omnidirectional microphones",
    "384ms echo cancellation",
    "Intelligent dynamic noise reduction",
    "Full-duplex call technology",
    "Built-in high-performance speaker",
    "Voice broadcast function",
    "Plug and play operation",
    "No driver installation required",
    "Supports mainstream video conferencing software",
    "Compatible with Windows and macOS",
    "Portable design",
    "Bluetooth 5.0",
    "10m Bluetooth connection distance"
  ],

  specifications: [
    {
      label: "Model",
      value: "CT3"
    },
    {
      label: "Microphone Type",
      value: "Portable USB/Bluetooth omnidirectional conference microphone"
    },
    {
      label: "Dimensions",
      value: "Φ135 × 37mm"
    },
    {
      label: "Color",
      value: "Black"
    },
    {
      label: "Weight",
      value: "≈332g"
    },
    {
      label: "Power",
      value: "5V 1A"
    },
    {
      label: "Battery",
      value: "3000mAh"
    },
    {
      label: "Battery Runtime",
      value: "7–8 hours on a full charge"
    },
    {
      label: "Connection",
      value: "USB cable connection, Bluetooth connection"
    },
    {
      label: "Microphones",
      value: "4 × omnidirectional microphones"
    },
    {
      label: "Microphone Sensitivity",
      value: "-38dB"
    },
    {
      label: "Maximum SPL",
      value: "94dB SPL @ 1KHz"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "65dB"
    },
    {
      label: "USB Mode Sampling",
      value: "16KHz pickup sampling rate + 48KHz playback sampling rate"
    },
    {
      label: "Bluetooth Call Mode Sampling",
      value: "16KHz pickup sampling rate + 16KHz playback sampling rate"
    },
    {
      label: "Bluetooth Playback Sampling",
      value: "48KHz playback sampling rate"
    },
    {
      label: "Speaker",
      value: "4Ω 5W"
    },
    {
      label: "Speaker Frequency Response",
      value: "100–24000Hz"
    },
    {
      label: "Number of Microphones",
      value: "4"
    },
    {
      label: "Audio Characteristics",
      value: "360° intelligent sound pickup, 384ms echo cancellation, intelligent dynamic noise reduction, full-duplex talk technology"
    },
    {
      label: "Pickup Distance",
      value: "3–5 meters radius"
    },
    {
      label: "Bluetooth Version",
      value: "5.0"
    },
    {
      label: "Bluetooth Operating Frequency",
      value: "2.4GHz"
    },
    {
      label: "Bluetooth Connection Distance",
      value: "10m"
    },
    {
      label: "USB Interface",
      value: "1 × Type-C"
    },
    {
      label: "Operating Temperature",
      value: "0°C to 44°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 85% non-condensing"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to 55°C"
    },
    {
      label: "Noise Level",
      value: "<48dB"
    },
    {
      label: "Reverberation Time",
      value: "<0.5 seconds"
    }
  ],

  applications: [
    "Video conferencing",
    "Conference rooms",
    "Business meetings",
    "Online meetings",
    "Remote collaboration",
    "Education and meeting environments"
  ],

  packageContents: [
    "Host ×1",
    "Type-C cable ×1",
    "Manual ×1",
    "Bluetooth receiver (optional)"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CT3 Bluetooth Cascade Omnidirectional Microphone",

    heroSubtitle:
      "Portable 360° conference microphone with USB, Bluetooth, wireless cascading, 3–5m pickup and built-in speaker.",

    keyBenefits: [
      "360° intelligent sound pickup",
      "3–5m pickup radius",
      "Wireless cascade of 2 devices",
      "USB and Bluetooth connectivity",
      "Bluetooth 5.0",
      "384ms echo cancellation",
      "Intelligent dynamic noise reduction",
      "Full-duplex communication",
      "4 built-in omnidirectional microphones",
      "7–8 hour battery life",
      "Built-in 5W speaker",
      "Plug and play"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CT3 Bluetooth Cascade Omnidirectional Microphone | IndoChinaBridge",

    metaDescription:
      "CT3 portable USB and Bluetooth conference microphone with 360° pickup, 3–5m range, wireless cascading, echo cancellation, noise reduction and built-in speaker.",

    keywords: [
      "CT3 microphone",
      "CT3 Bluetooth microphone",
      "Bluetooth conference microphone",
      "cascade conference microphone",
      "omnidirectional conference microphone",
      "360 degree conference microphone",
      "wireless cascade microphone",
      "USB conference microphone",
      "China conference microphone"
    ]
  },
status: "active"
},


{
  productName: "CT9 Set Wired Cascaded Omnidirectional Microphone",

  slug: "ct9-set-wired-cascaded-omnidirectional-microphone",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Wired Cascaded Omnidirectional Microphone",

  shortDescription:
    "Wired cascaded omnidirectional conference microphone system with an audio gateway, 360° pickup, 3–5m pickup radius and support for up to 8 cascaded microphones.",

  description:
    "The CT9 set is a USB wired cascading omnidirectional microphone system consisting of the CT9S audio gateway and CT9M omnidirectional microphone. Up to 8 omnidirectional microphones can be wired cascaded, allowing all connected microphones to pick up and play sound simultaneously. The system supports multiple connection methods through the audio gateway, including wireless receiver, USB and 3.5mm analog interfaces. It provides 360° sound pickup, echo cancellation, intelligent dynamic noise reduction and full-duplex communication for conference environments.",

  images: [],

  features: [
    "USB wired cascading omnidirectional microphone system",
    "CT9S audio gateway",
    "CT9M omnidirectional microphone",
    "Up to 8 microphones can be wired cascaded",
    "All cascaded microphones can pick up and play sound simultaneously",
    "360° omnidirectional sound pickup",
    "3–5m pickup radius per microphone",
    "3 built-in omnidirectional microphones per single unit",
    "640ms echo cancellation",
    "Intelligent dynamic noise reduction",
    "Full-duplex communication technology",
    "Powerful built-in amplifier",
    "High-quality audio output",
    "Wireless receiver connection",
    "USB wired connection",
    "3.5mm analog connection",
    "Plug and play",
    "No driver installation required",
    "Touch buttons",
    "Compatible with Windows and macOS",
    "Supports mainstream video conferencing software"
  ],

  specifications: [
    {
      label: "Product System",
      value: "CT9 Set"
    },
    {
      label: "Audio Gateway",
      value: "CT9S"
    },
    {
      label: "Omnidirectional Microphone",
      value: "CT9M"
    },
    {
      label: "Maximum Cascaded Microphones",
      value: "Up to 8 devices"
    },
    {
      label: "Cascading Type",
      value: "Wired cascading"
    },
    {
      label: "Microphones per Single Unit",
      value: "3 omnidirectional microphones"
    },
    {
      label: "Sound Pickup",
      value: "360° intelligent sound pickup"
    },
    {
      label: "Pickup Distance",
      value: "3–5m radius per single unit"
    },
    {
      label: "Microphone Sensitivity",
      value: "-38dB"
    },
    {
      label: "Maximum SPL",
      value: "94dB SPL @ 1KHz"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "65dB"
    },
    {
      label: "Microphone Sampling",
      value: "48KHz pickup sampling rate + 48KHz playback sampling rate"
    },
    {
      label: "Speaker",
      value: "4Ω 8W × 2 per single unit"
    },
    {
      label: "Frequency Response",
      value: "100–24000Hz"
    },
    {
      label: "Echo Cancellation",
      value: "640ms"
    },
    {
      label: "Audio Processing",
      value: "Intelligent dynamic noise reduction and full-duplex call technology"
    },
    {
      label: "Audio Gateway Dimensions",
      value: "166 × 76 × 36.5mm"
    },
    {
      label: "Omnidirectional Microphone Dimensions",
      value: "260 × 130 × 50mm"
    },
    {
      label: "Audio Gateway Weight",
      value: "≈295g"
    },
    {
      label: "Omnidirectional Microphone Weight",
      value: "≈666g"
    },
    {
      label: "Color",
      value: "Business black"
    },
    {
      label: "Power",
      value: "12V 2A"
    },
    {
      label: "Connection Methods",
      value: "Wireless receiver, USB wired, 3.5mm analog interface"
    },
    {
      label: "Operating Temperature",
      value: "0°C to 44°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 85% non-condensing"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to 55°C"
    },
    {
      label: "Noise Level",
      value: "<48dB"
    },
    {
      label: "Reverberation Time",
      value: "<0.5 seconds"
    },
    {
      label: "Audio Gateway Interfaces",
      value: "Power interface, Type-C interface, 2 × network cable interfaces, 3.5mm IN & OUT"
    },
    {
      label: "Microphone Interfaces",
      value: "2 × cascaded RJ45 interfaces, Type-C interface, power interface"
    },
    {
      label: "Microphone Controls",
      value: "Volume -, Volume +, microphone control key, speaker control key"
    }
  ],

  applications: [
    "Conference rooms",
    "Video conferencing",
    "Meeting rooms",
    "Business meetings",
    "Remote collaboration",
    "Education and conference environments"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CT9 Wired Cascaded Omnidirectional Microphone System",

    heroSubtitle:
      "Professional conference audio system with up to 8 wired cascaded microphones, 360° pickup and 3–5m pickup radius per unit.",

    keyBenefits: [
      "Up to 8 microphones can be cascaded",
      "360° intelligent sound pickup",
      "3–5m pickup radius per unit",
      "640ms echo cancellation",
      "Intelligent dynamic noise reduction",
      "Full-duplex communication",
      "48KHz audio sampling",
      "4Ω 8W × 2 speakers per unit",
      "USB, wireless receiver and 3.5mm connectivity",
      "Plug and play operation",
      "Compatible with Windows and macOS"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CT9 Wired Cascaded Omnidirectional Microphone System | IndoChinaBridge",

    metaDescription:
      "CT9S and CT9M wired cascaded conference microphone system supporting up to 8 microphones, 360° pickup, 3–5m range, echo cancellation and noise reduction.",

    keywords: [
      "CT9 microphone",
      "CT9S audio gateway",
      "CT9M microphone",
      "wired cascaded microphone",
      "cascaded conference microphone",
      "omnidirectional conference microphone",
      "360 degree conference microphone",
      "8 microphone conference system",
      "China conference microphone"
    ]
  },

 status: "active"
},


{
  productName: "CT10D Interactive Omnidirectional Audio Acquisition System",

  slug: "ct10d-interactive-omnidirectional-audio-acquisition-system",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Ceiling Microphone Audio Acquisition System",

  shortDescription:
    "USB-connected interactive audio acquisition system with two ceiling-mounted spherical microphones, 10m pickup radius, 24-bit/48kHz audio and adaptive audio processing.",

  description:
    "The CT10D Interactive Omnidirectional Audio Acquisition System is a USB-connected audio processor designed to work with two wired ceiling microphones, local computers, active speakers and video conferencing hosts. It provides up to 10m microphone pickup, 48kHz high-fidelity audio, adaptive echo cancellation, adaptive noise suppression, adaptive voice gain adjustment and intelligent mixing. The system supports 24-bit A/D and D/A conversion and provides 2-channel balanced outputs through Phoenix terminal blocks.",

  images: ["https://res.cloudinary.com/drx3wkg1h/image/upload/v1790061818/ChatGPT_Image_Sep_22_2026_12_52_16_PM_u5qbty.png"],

  features: [
    "USB-connected interactive audio acquisition system",
    "Supports 2 wired ceiling microphones",
    "Up to 10m microphone pickup radius",
    "48kHz high-fidelity audio sampling",
    "24-bit A/D and D/A conversion",
    "High signal-to-noise ratio",
    "Adaptive echo cancellation",
    "Adaptive noise suppression",
    "Adaptive voice gain adjustment",
    "Intelligent mixing",
    "Up to 18dB noise reduction",
    "2-channel balanced outputs",
    "DIP switch function configuration",
    "Plug-and-play operation",
    "Independent input and output volume controls",
    "Compatible with mainstream teaching and conference systems",
    "Compatible with general educational and conference software platforms"
  ],

  specifications: [
    {
      label: "Model",
      value: "CT10D"
    },
    {
      label: "System Type",
      value: "Interactive Omnidirectional Audio Acquisition System"
    },
    {
      label: "Microphone Configuration",
      value: "2 × wired ceiling-mounted spherical omnidirectional microphones"
    },
    {
      label: "Maximum Pickup Radius",
      value: "10m"
    },
    {
      label: "Audio Sampling Rate",
      value: "48kHz"
    },
    {
      label: "Audio Resolution",
      value: "24-bit"
    },
    {
      label: "Noise Reduction",
      value: "Up to 18dB"
    },
    {
      label: "Audio Processing",
      value: "Adaptive echo cancellation, adaptive noise suppression, adaptive gain adjustment and intelligent mixing"
    },
    {
      label: "Color",
      value: "Matte Black"
    },
    {
      label: "Power Input",
      value: "100–240V, 0.5A, 50/60Hz"
    },
    {
      label: "Power Output",
      value: "DC 12V, 2A"
    },
    {
      label: "USB",
      value: "Type-B USB"
    },
    {
      label: "Power Interface",
      value: "DC 12V Power Port"
    },
    {
      label: "Audio Terminal",
      value: "2-channel 3.81mm Phoenix Terminal Blocks"
    },
    {
      label: "Microphone Sensor",
      value: "Φ25 Back Electret Condenser Cartridge"
    },
    {
      label: "Microphone Circuit",
      value: "JFET impedance conversion, electronic balancing"
    },
    {
      label: "Microphone Polar Pattern",
      value: "Unidirectional Supercardioid"
    },
    {
      label: "Microphone Frequency Response",
      value: "50Hz–20kHz"
    },
    {
      label: "Microphone Sensitivity",
      value: "-47±3dB"
    },
    {
      label: "Microphone Rated Output Impedance",
      value: "2.2kΩ"
    },
    {
      label: "Microphone Minimum Load Impedance",
      value: "1000Ω"
    },
    {
      label: "Microphone SNR",
      value: "75dB"
    },
    {
      label: "Microphone Maximum SPL",
      value: "115dB"
    },
    {
      label: "Microphone Maximum Output Level",
      value: "1.6dBV (1.2V)"
    },
    {
      label: "Microphone Output Connector",
      value: "Mini XLR-3 Male"
    },
    {
      label: "Microphone Cable",
      value: "Twisted Shielded Microphone Cable"
    },
    {
      label: "Audio Processor Frequency Response",
      value: "20Hz–20kHz @ +4dBu"
    },
    {
      label: "Microphone Channel Response",
      value: "+0/-2dB"
    },
    {
      label: "Line Input Channel Response",
      value: "+0/-0.5dB"
    },
    {
      label: "Microphone Channel THD+N",
      value: "<0.009%"
    },
    {
      label: "Line Input Channel THD+N",
      value: "<0.007%"
    },
    {
      label: "Equivalent Noise",
      value: "<-84dBu"
    },
    {
      label: "Dynamic Range",
      value: ">105dB"
    },
    {
      label: "Microphone Maximum Input Level",
      value: "-2dBu"
    },
    {
      label: "Line Input Maximum Level",
      value: "20dBu"
    },
    {
      label: "Balanced Maximum Output Level",
      value: "20dBu"
    },
    {
      label: "Microphone Channel Maximum Gain",
      value: "50dB"
    },
    {
      label: "Line Input Channel Gain",
      value: "0dB"
    },
    {
      label: "Microphone Channel Input Impedance",
      value: "330Ω"
    },
    {
      label: "Line Input Channel Impedance",
      value: "20kΩ"
    },
    {
      label: "Output Impedance",
      value: "400Ω"
    },
    {
      label: "A/D-D/A Converter",
      value: "24-bit"
    },
    {
      label: "Operating Temperature",
      value: "20°C–70°C"
    },
    {
      label: "Operating Humidity",
      value: "20%–90% non-condensing"
    },
    {
      label: "Storage Temperature",
      value: "20°C–70°C"
    },
    {
      label: "Noise Level",
      value: "<48dB"
    }
  ],

  applications: [
    "Video conferencing",
    "Conference rooms",
    "Distance education",
    "Classrooms",
    "Teaching systems",
    "Remote voice interaction",
    "Interactive meeting systems"
  ],

  packageContents: [
    "1 × Main Unit",
    "2 × Spherical Omnidirectional Microphones",
    "2 × Spherical Omnidirectional Microphone Connection Cables",
    "1 × Speaker-Specific Connection Cable",
    "1 × Red-White RCA to Phoenix Terminal Adapter",
    "2 × 3.5mm Audio to Phoenix Terminal Adapters",
    "1 × Type-B USB Cable",
    "Phoenix Terminals",
    "1 × Power Adapter",
    "1 × User Manual"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CT10D Interactive Omnidirectional Audio Acquisition System",

    heroSubtitle:
      "Professional ceiling microphone audio system with 10m pickup, 24-bit/48kHz audio and adaptive voice processing.",

    keyBenefits: [
      "10m maximum microphone pickup radius",
      "2 ceiling-mounted spherical microphones",
      "24-bit/48kHz high-fidelity audio",
      "Adaptive echo cancellation",
      "Adaptive noise suppression",
      "Adaptive voice gain adjustment",
      "Intelligent mixing",
      "Up to 18dB noise reduction",
      "75dB microphone SNR",
      "115dB maximum microphone SPL",
      "2-channel balanced outputs",
      "Plug-and-play deployment"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CT10D Interactive Omnidirectional Audio Acquisition System | IndoChinaBridge",

    metaDescription:
      "CT10D ceiling microphone audio acquisition system with two microphones, 10m pickup radius, 24-bit/48kHz audio, echo cancellation and intelligent mixing.",

    keywords: [
      "CT10D",
      "CT10D audio acquisition system",
      "ceiling microphone system",
      "omnidirectional ceiling microphone",
      "10m pickup microphone",
      "conference audio system",
      "ceiling conference microphone",
      "interactive audio acquisition system",
      "China conference audio system"
    ]
  },
status: "active"
},


{
  productName: "CT20 Seamless Local Omnidirectional Audio Capture and Amplification System",

  slug: "ct20-seamless-local-omnidirectional-audio-capture-and-amplification-system",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Ceiling Microphone",

  shortDescription:
    "Local sound reinforcement and 360° omnidirectional audio capture system with built-in audio processing, USB power and 3.5mm speaker connectivity.",

  description:
    "The CT20 Seamless Local Omnidirectional Audio Capture and Amplification System is designed for local sound reinforcement. It combines omnidirectional audio capture with local sound reinforcement equipment to provide clear and authentic sound throughout a room. Its built-in audio processing and environment-adaptive algorithms provide howling suppression, automatic gain control, automatic noise cancellation and reverberation reduction. The system supports hands-free operation, long-distance sound pickup and real-time interaction with remote participants.",

  images: ["https://res.cloudinary.com/drx3wkg1h/image/upload/v1790061818/ChatGPT_Image_Sep_22_2026_12_46_47_PM_xjk2kp.png"],

  features: [
    "360° omnidirectional sound pickup",
    "Built-in audio processor",
    "Environment-adaptive audio algorithms",
    "Automatic howling suppression",
    "Automatic gain control",
    "Automatic noise cancellation",
    "Automatic reverberation suppression",
    "Intelligent dynamic noise reduction",
    "Long-distance sound pickup",
    "Hands-free operation",
    "Local synchronous sound reinforcement",
    "Simple deployment",
    "USB-powered operation",
    "3.5mm audio connection to active speakers",
    "No complex wiring, installation or debugging required"
  ],

  specifications: [
    {
      label: "Model",
      value: "CT20"
    },
    {
      label: "Product Type",
      value: "Seamless Local Omnidirectional Audio Capture and Amplification System"
    },
    {
      label: "Size",
      value: "156 × 156 × 36 mm"
    },
    {
      label: "Color",
      value: "White"
    },
    {
      label: "Net Weight",
      value: "Approximately 224.3g"
    },
    {
      label: "Power",
      value: "USB 5V"
    },
    {
      label: "Connection",
      value: "USB cable for power and 3.5mm audio cable for connection to speakers"
    },
    {
      label: "Operating Temperature",
      value: "0°C to 44°C"
    },
    {
      label: "Operating Humidity",
      value: "20% to 85% non-condensing"
    },
    {
      label: "Storage Temperature",
      value: "-10°C to 55°C"
    },
    {
      label: "Noise Level",
      value: "<48dB"
    },
    {
      label: "Reverberation Time",
      value: "<0.5 seconds"
    },
    {
      label: "Microphone Sensitivity",
      value: "-34.7dB"
    },
    {
      label: "Microphone SNR",
      value: "70dB"
    },
    {
      label: "Audio Sampling Rate",
      value: "16KHz"
    },
    {
      label: "Number of Microphones",
      value: "2"
    },
    {
      label: "Sound Pickup",
      value: "360° intelligent sound pickup"
    },
    {
      label: "Sound Pickup Distance",
      value: "≥5 meters radius"
    },
    {
      label: "Audio Processing",
      value: "Intelligent dynamic noise reduction, automatic howling suppression and automatic reverberation suppression"
    },
    {
      label: "Interfaces",
      value: "USB Interface, LINE IN Interface, 2 × Speaker-Out Interfaces"
    }
  ],

  applications: [
    "Local sound reinforcement",
    "Conference rooms",
    "Meeting rooms",
    "Interactive meetings",
    "Remote interaction",
    "Classrooms",
    "Presentation environments"
  ],

  packageContents: [
    "1 × Main Unit",
    "1 × USB Cable",
    "1 × Audio Cable"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle:
      "CT20 Seamless Local Omnidirectional Audio Capture and Amplification System",

    heroSubtitle:
      "360° intelligent sound pickup with built-in audio processing for clear local sound reinforcement.",

    keyBenefits: [
      "360° omnidirectional sound pickup",
      "≥5m sound pickup radius",
      "Built-in audio processing",
      "Automatic howling suppression",
      "Automatic noise cancellation",
      "Automatic gain control",
      "Automatic reverberation suppression",
      "70dB microphone SNR",
      "Simple USB-powered deployment",
      "Hands-free operation"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CT20 Seamless Omnidirectional Audio Capture System | IndoChinaBridge",

    metaDescription:
      "CT20 ceiling microphone audio capture and amplification system with 360° pickup, ≥5m pickup distance, built-in audio processing and USB-powered operation.",

    keywords: [
      "CT20",
      "CT20 microphone",
      "omnidirectional audio capture",
      "ceiling microphone",
      "conference microphone",
      "360 degree microphone",
      "local sound reinforcement system",
      "audio amplification system",
      "China conference audio equipment"
    ]
  },

  status: "active"
},

{
  productName: "CV3 Wide-Angle USB 2.0 HD Camera",

  slug: "cv3-wide-angle-usb-2-0-hd-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "USB Conference Camera",

  shortDescription:
    "1080P USB 2.0 HD conference camera with 120° wide-angle lens, mechanically adjustable shooting angles and plug-and-play operation.",

  description:
    "The CV3 Wide-Angle USB 2.0 HD Camera is a plug-and-play conference webcam designed for video conferencing and online communication. It features a 1080P HD CMOS sensor, 120° wide-angle fixed-focus lens and mechanically adjustable shooting angles. The camera connects through USB 2.0 without requiring driver installation and is compatible with common video conferencing and calling software.",

  images: [],

  features: [
    "1080P Full HD video",
    "120° wide-angle shooting",
    "Clear and smooth real-time video",
    "Mechanically adjustable lens",
    "Vertical adjustment from -30° to +30°",
    "Horizontal adjustment from -150° to +150°",
    "Fixed-focus lens",
    "Plug-and-play USB connection",
    "No driver installation required",
    "Universal clip for various display devices",
    "Compact and lightweight design",
    "Compatible with common video conferencing software"
  ],

  specifications: [
    {
      label: "Model",
      value: "CV3"
    },
    {
      label: "Product Type",
      value: "Wide-Angle USB 2.0 HD Conference Camera"
    },
    {
      label: "Size",
      value: "104 × 139 × 124 mm"
    },
    {
      label: "Maximum Camera Stand Extension",
      value: "250 mm"
    },
    {
      label: "Minimum Camera Stand Length",
      value: "200 mm"
    },
    {
      label: "Net Weight",
      value: "465 g"
    },
    {
      label: "Gross Weight",
      value: "703 g"
    },
    {
      label: "Color",
      value: "Business Black"
    },
    {
      label: "Connection",
      value: "USB Data Cable"
    },
    {
      label: "Power",
      value: "USB 5V 500mA"
    },
    {
      label: "Operating Temperature",
      value: "-20°C to 70°C"
    },
    {
      label: "Optimal Shooting Temperature",
      value: "0°C to 50°C"
    },
    {
      label: "Lens",
      value: "1/2.8 inch fixed-focus lens"
    },
    {
      label: "Field of View",
      value: "120°"
    },
    {
      label: "Tilt Movement",
      value: "-30° to +30°"
    },
    {
      label: "Pan Movement",
      value: "-150° to +150°"
    },
    {
      label: "Video Resolution",
      value: "1920 × 1080P"
    },
    {
      label: "Image Sensor",
      value: "HD CMOS Sensor"
    },
    {
      label: "MJPG Video Rate",
      value: "30FPS"
    },
    {
      label: "YUV Video Rate",
      value: "5FPS"
    },
    {
      label: "Aperture",
      value: "F2.0"
    },
    {
      label: "Focus Distance",
      value: "30cm–300cm optimal"
    },
    {
      label: "Interface",
      value: "USB 2.0"
    },
    {
      label: "Cable Length",
      value: "1.8m"
    },
    {
      label: "Maximum Extension Cable Length",
      value: "3m"
    }
  ],

  applications: [
    "Video conferencing",
    "Online meetings",
    "Internet video conferencing",
    "Video calling",
    "Remote communication",
    "Online collaboration"
  ],

  packageContents: [
    "1 × Camera",
    "1 × User Manual",
    "1 × Telescopic Stand (Optional)"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CV3 Wide-Angle USB 2.0 HD Camera",

    heroSubtitle:
      "1080P wide-angle conference camera with 120° field of view and flexible mechanical adjustment.",

    keyBenefits: [
      "1080P Full HD video",
      "120° wide-angle field of view",
      "Flexible pan and tilt adjustment",
      "USB 2.0 plug-and-play connectivity",
      "No driver installation required",
      "Compact and lightweight design",
      "Universal display-device clip",
      "Compatible with video conferencing software"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CV3 Wide-Angle USB 2.0 HD Conference Camera | IndoChinaBridge",

    metaDescription:
      "CV3 1080P USB 2.0 HD conference camera with 120° wide-angle lens, adjustable pan and tilt, fixed focus and plug-and-play operation.",

    keywords: [
      "CV3 camera",
      "CV3 conference camera",
      "USB conference camera",
      "USB 2.0 HD camera",
      "1080P conference camera",
      "120 degree camera",
      "wide angle conference camera",
      "video conferencing camera",
      "China conference camera"
    ]
  },

  status: "active"
},

{
  productName: "CV5 Multi-Interface HD Optical Zoom Live Streaming Camera",

  slug: "cv5-multi-interface-hd-optical-zoom-live-streaming-camera",

  category: "Conference Cameras",

  mainCategory: "Conference Device",

  subCategory: "Live Streaming Camera",

  shortDescription:
    "Professional 1080P live streaming camera with 18x optical zoom, up to 60fps, USB, HDMI and RJ45 interfaces, and UVC/NDI video transmission.",

  description:
    "The CV5 is a high-definition live streaming camera designed for professional live broadcasting and video conferencing. It features an 18x optical zoom lens, 1080P resolution and frame rates up to 60fps. The camera uses a 1/2.8-inch HD CMOS sensor and provides USB, HDMI and RJ45 interfaces for flexible connectivity and direct network transmission. It supports plug-and-play operation without driver installation and is compatible with Windows, macOS and Android.",

  images: [],

  features: [
    "1080P high-definition video",
    "18x optical zoom",
    "Up to 60fps video transmission",
    "1/2.8-inch HD CMOS sensor",
    "USB interface",
    "HDMI interface",
    "RJ45 Ethernet interface",
    "Direct network transmission",
    "UVC video transmission",
    "NDI video transmission",
    "Manual and automatic lens adjustment",
    "High-speed automatic precision focusing",
    "Multifunctional infrared remote control",
    "Plug-and-play operation",
    "No driver installation required",
    "Landscape and portrait mounting support",
    "Green screen blocking support",
    "Beauty enhancement support",
    "Compatible with Windows and macOS"
  ],

  specifications: [
    {
      label: "Model",
      value: "CV5"
    },
    {
      label: "Product Type",
      value: "Multi-Interface HD Optical Zoom Live Streaming Camera"
    },
    {
      label: "Size",
      value: "Φ80 × 125 mm"
    },
    {
      label: "Color",
      value: "Business Black"
    },
    {
      label: "Net Weight",
      value: "550g"
    },
    {
      label: "Connection",
      value: "USB Data Cable"
    },
    {
      label: "Power",
      value: "12V 2A"
    },
    {
      label: "Operating Temperature",
      value: "-20°C to 70°C"
    },
    {
      label: "Optimal Shooting Temperature",
      value: "0°C to 50°C"
    },
    {
      label: "Supported Operating Systems",
      value: "Windows 7, Windows 8, Windows 10, Mac OS X, Android"
    },
    {
      label: "Optical Zoom",
      value: "18x"
    },
    {
      label: "Image Sensor",
      value: "1/2.8-inch HD CMOS"
    },
    {
      label: "Image Sensor Resolution",
      value: "2.1 Megapixels"
    },
    {
      label: "Video Quality",
      value: "1080P"
    },
    {
      label: "Maximum USB 2.0 Transmission",
      value: "MJPG: 60fps"
    },
    {
      label: "Maximum USB 3.0 Transmission",
      value: "YUV: 60fps"
    },
    {
      label: "Communication Protocol",
      value: "UVC, NDI"
    },
    {
      label: "Video Encoding",
      value: "MJPEG, YUV"
    },
    {
      label: "Image Resolution",
      value: "1920 × 1080P"
    },
    {
      label: "Field of View",
      value: "54°"
    },
    {
      label: "Interfaces",
      value: "USB, Power, HDMI, RJ45"
    }
  ],

  applications: [
    "Professional live streaming",
    "Video conferencing",
    "Online broadcasting",
    "Live product broadcasting",
    "Remote meetings",
    "Video production",
    "Online collaboration"
  ],

  packageContents: [
    "1 × Camera",
    "1 × Power Adapter",
    "1 × Remote Control",
    "1 × HDMI Cable",
    "1 × USB Data Cable",
    "1 × Manual"
  ],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CV5 Multi-Interface HD Optical Zoom Live Streaming Camera",

    heroSubtitle:
      "Professional 1080P camera with 18x optical zoom, 60fps video and USB, HDMI and RJ45 connectivity.",

    keyBenefits: [
      "18x optical zoom",
      "1080P high-definition video",
      "Up to 60fps transmission",
      "1/2.8-inch HD CMOS sensor",
      "USB, HDMI and RJ45 interfaces",
      "UVC and NDI support",
      "Manual and automatic focusing",
      "Plug-and-play operation",
      "Professional live streaming support",
      "Video conferencing compatible"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CV5 Multi-Interface HD Optical Zoom Live Streaming Camera | IndoChinaBridge",

    metaDescription:
      "CV5 professional 1080P live streaming camera with 18x optical zoom, 60fps, USB, HDMI, RJ45, UVC and NDI support.",

    keywords: [
      "CV5 camera",
      "CV5 live streaming camera",
      "18x optical zoom camera",
      "1080P live streaming camera",
      "professional streaming camera",
      "USB HDMI RJ45 camera",
      "NDI camera",
      "UVC camera",
      "conference camera",
      "China live streaming camera"
    ]
  },

  status: "active"
},

{
  productName: "CHEVLEN MIC40 Desktop Digital Interface Microphone",

  slug: "chevlen-mic40-desktop-digital-interface-microphone",

  category: "Conference Audio",

  mainCategory: "Conference Device",

  subCategory: "Desktop Digital Microphone",

  shortDescription:
    "Compact omnidirectional desktop digital interface microphone designed for meetings, teaching, interviews, speeches and broadcasting.",

  description:
    "The CHEVLEN MIC40 is a desktop digital interface microphone designed for meetings, teaching, interviews, speeches and broadcasting. It combines conference microphone and omnidirectional microphone characteristics with compact portability and simple operation. The microphone provides 360° omnidirectional sound pickup and supports long-distance sound pickup within 2 meters. It also features RFI shielding, a non-slip base, touch-type mute control and 48V phantom power.",

  images: [],

  features: [
    "Omnidirectional high-definition sound pickup",
    "360° sound pickup",
    "Long-distance sound pickup within 2 meters",
    "Designed for meetings, teaching, interviews, speeches and broadcasting",
    "Radio Frequency Interference (RFI) shielding",
    "Reduces mobile phone signal interference",
    "Non-slip rubber pads",
    "Reduces desktop vibration noise",
    "Touch-type mute switch",
    "Compact and portable design",
    "Simple operation without complex debugging",
    "Compatible with chairman and guest conference units",
    "Can work with Light Conference network audio control center"
  ],

  specifications: [
    {
      label: "Model",
      value: "CHEVLEN MIC40"
    },
    {
      label: "Product Type",
      value: "Desktop Digital Interface Microphone"
    },
    {
      label: "Directivity",
      value: "Omnidirectional"
    },
    {
      label: "Frequency Response",
      value: "40Hz–20,000Hz"
    },
    {
      label: "Sensitivity",
      value: "-40dB (7.0mV)"
    },
    {
      label: "Output Impedance",
      value: "200Ω"
    },
    {
      label: "Maximum Sound Pressure Level",
      value: "138dB at 1kHz"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "67dB, 1kHz AT PA"
    },
    {
      label: "Dynamic Range",
      value: "111dB, 1kHz AT MAX SPL"
    },
    {
      label: "Sound Pickup",
      value: "60° elevation angle toward speaker axis forming a 150° conical sound pickup direction"
    },
    {
      label: "Sound Pickup Range",
      value: "Long-distance pickup within 2 meters"
    },
    {
      label: "Sound Pickup Direction",
      value: "360° omnidirectional"
    },
    {
      label: "Dimensions",
      value: "85 × 95 × 23 mm (W × D × H)"
    },
    {
      label: "Power Supply",
      value: "48V Phantom Power Supply"
    },
    {
      label: "Cable",
      value: "5-meter parallel cable"
    }
  ],

  applications: [
    "Meetings",
    "Teaching",
    "Interviews",
    "Speeches",
    "Broadcasting",
    "Network meetings",
    "Recording",
    "Digital conference systems"
  ],

  packageContents: [],

  customization: {
    available: false,
    details: ""
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CHEVLEN MIC40 Desktop Digital Interface Microphone",

    heroSubtitle:
      "Compact omnidirectional desktop microphone for clear sound pickup across meetings, teaching, interviews, speeches and broadcasting.",

    keyBenefits: [
      "360° omnidirectional sound pickup",
      "Up to 2m long-distance sound pickup",
      "40Hz–20kHz frequency response",
      "138dB maximum SPL",
      "67dB signal-to-noise ratio",
      "RFI shielding technology",
      "Touch-type mute control",
      "Non-slip vibration-resistant base",
      "Compact desktop design",
      "48V phantom power"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CHEVLEN MIC40 Desktop Digital Interface Microphone | IndoChinaBridge",

    metaDescription:
      "CHEVLEN MIC40 omnidirectional desktop digital interface microphone with 2m pickup, 40Hz–20kHz response, RFI shielding and touch mute.",

    keywords: [
      "CHEVLEN MIC40",
      "MIC40 microphone",
      "desktop digital microphone",
      "conference microphone",
      "omnidirectional microphone",
      "desktop conference microphone",
      "digital interface microphone",
      "meeting microphone",
      "broadcast microphone",
      "China conference microphone"
    ]
  },

  status: "active"
},

{
  productName: "M100 BYOD Wireless Conferencing System",

  slug: "m100-byod-wireless-conferencing-system",

  category: "Wireless Conferencing",

  mainCategory: "Conference Device",

  subCategory: "BYOD Wireless Presentation System",

  shortDescription:
    "Wireless BYOD conferencing and presentation system with 4-screen split display, 100m transmission, 4K@60Hz output and USB, Type-C and HDMI connectivity.",

  description:
    "The M100 BYOD Wireless Conferencing System is designed for interactive wireless presentations and meeting scenarios. The 3-in-1 transmitter provides USB, Type-C and HDMI interfaces, while the system supports one-click content sharing, wireless screen mirroring, touchback and reverse control. It supports up to 100 meters of wireless transmission and provides 4K@60Hz output through Type-C and HDMI transmitter ports and 1080P@60Hz through the USB transmitter port. The system uses a driver-free plug-and-play hardware design and supports computers, tablets, iPhones and Android phones.",

  images: [],

  features: [
    "3-in-1 transmitter with USB, Type-C and HDMI interfaces",
    "Supports 4-screen split display",
    "Wireless presentation and screen mirroring",
    "Up to 100m wireless transmission",
    "4K@60Hz output via Type-C and HDMI transmitter ports",
    "1080P@60Hz output via USB transmitter port",
    "One-click content sharing",
    "Supports Windows and Mac devices",
    "Supports laptops, mobile phones and tablets",
    "Touchback and reverse control",
    "Built-in host control mode",
    "Real-time writing and annotation",
    "QR-code file sharing",
    "Driver-free plug-and-play design",
    "Customizable device name and screen mirroring code",
    "Bluetooth audio transmission for Android phones",
    "Wireless screen mirroring via Type-C and HDMI",
    "USB transmitter screen mirroring",
    "Supports Miracast and AirPlay",
    "Supports UVC and wireless screen sharing"
  ],

  specifications: [
    {
      label: "Model",
      value: "M100"
    },
    {
      label: "Product Type",
      value: "BYOD Wireless Conferencing System"
    },
    {
      label: "Display Mode",
      value: "Single View, Dual Views, Four Views"
    },
    {
      label: "Maximum Simultaneous Display",
      value: "4 screens"
    },
    {
      label: "Wireless Transmission Distance",
      value: "Up to 100m"
    },
    {
      label: "Type-C / HDMI Transmitter Output",
      value: "4K@60Hz"
    },
    {
      label: "USB Transmitter Output",
      value: "1080P@60Hz"
    },
    {
      label: "Windows Resolution",
      value: "3840×2160@60, 1920×1080, 1366×768, 1360×768, 1280×800, 1024×768, 1280×720"
    },
    {
      label: "Windows Frame Rate",
      value: "18–30 fps"
    },
    {
      label: "Windows Total Delay",
      value: "100–200ms"
    },
    {
      label: "Windows Supported Systems",
      value: "Windows 7/8/10"
    },
    {
      label: "USB Wireless Mirroring Resolution",
      value: "720P–1080P"
    },
    {
      label: "USB Wireless Mirroring Frame Rate",
      value: "18–30 fps"
    },
    {
      label: "USB Wireless Transmission Distance",
      value: "30m without obstructions"
    },
    {
      label: "USB Wireless Connections",
      value: "1–8 channels, maximum capacity 16"
    },
    {
      label: "Wireless Transmission Speed",
      value: "300Mbps"
    },
    {
      label: "Wireless Protocol",
      value: "IEEE 802.11 a/g/n/ac"
    },
    {
      label: "Wireless Frequency",
      value: "5.8G, multi-channel selection"
    },
    {
      label: "Security Protocol",
      value: "WPA2-PSK"
    },
    {
      label: "Supported USB Wireless Systems",
      value: "Windows 7/8/10, Apple Mac"
    },
    {
      label: "Mobile Wi-Fi",
      value: "Dual Wi-Fi with 5G hotspot and 2.4GHz Wi-Fi operating simultaneously"
    },
    {
      label: "Mobile Screen Mirroring",
      value: "Miracast, AirPlay and USB wireless screen casting"
    },
    {
      label: "Android Support",
      value: "Android 5.0 and above"
    },
    {
      label: "iPhone Support",
      value: "iOS 8 and above with AirPlay screen mirroring"
    },
    {
      label: "Video Output",
      value: "HDMI"
    },
    {
      label: "Video Decoding",
      value: "H.264, H.265, VP8, RV, WMV, AVS, H.263, MPEG4"
    },
    {
      label: "Maximum Video Decoding Resolution",
      value: "4K"
    },
    {
      label: "Operating System",
      value: "Android 7.1"
    },
    {
      label: "CPU",
      value: "ARM Cortex A7 × 4"
    },
    {
      label: "Memory",
      value: "1G DDR3"
    },
    {
      label: "Storage",
      value: "8G TF, expandable up to 64G"
    },
    {
      label: "HDMI Output",
      value: "1"
    },
    {
      label: "HDMI Output Resolution",
      value: "Maximum 3840×2160 and 1920×1080 at 60Hz"
    },
    {
      label: "Wired Network",
      value: "RJ45"
    },
    {
      label: "Wi-Fi",
      value: "802.11AC 5.8G / 2.4G"
    },
    {
      label: "USB HID Mouse",
      value: "Supported"
    },
    {
      label: "Infrared Touch",
      value: "Supported"
    },
    {
      label: "Capacitive Touch",
      value: "Supported"
    },
    {
      label: "Power Input",
      value: "DC 12V"
    },
    {
      label: "Maximum Power",
      value: "12W"
    },
    {
      label: "Dimensions",
      value: "120 × 120 × 21.5mm"
    },
    {
      label: "Wi-Fi Antennas",
      value: "3"
    },
    {
      label: "Push Buttons",
      value: "≥1"
    },
    {
      label: "Working Temperature",
      value: "0°C–40°C"
    },
    {
      label: "Working Humidity",
      value: "10%–90%"
    }
  ],

  applications: [
    "Corporate meeting rooms",
    "Wireless presentations",
    "BYOD meetings",
    "Video conferencing",
    "Education and classrooms",
    "Training rooms",
    "Interactive presentations",
    "Remote collaboration",
    "Screen sharing"
  ],

  packageContents: [
    "1 × Power Adapter",
    "3 × Wi-Fi Antennas",
    "≥1 × Push Button"
  ],

  customization: {
    available: true,
    details: "Supports customizable device name and screen mirroring code."
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "M100 BYOD Wireless Conferencing System",

    heroSubtitle:
      "Wireless presentation and conferencing solution with 4-screen split display, 4K output and long-distance transmission.",

    keyBenefits: [
      "Up to 100m wireless transmission",
      "4-screen split display",
      "4K@60Hz output",
      "USB, Type-C and HDMI transmitter interfaces",
      "One-click wireless content sharing",
      "Touchback and reverse control",
      "Real-time annotation",
      "QR-code file sharing",
      "Miracast and AirPlay support",
      "Driver-free plug-and-play operation",
      "Windows, Mac, iPhone and Android support"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "M100 BYOD Wireless Conferencing System | IndoChinaBridge",

    metaDescription:
      "M100 BYOD wireless conferencing and presentation system with 4-screen split display, 4K@60Hz output, 100m transmission and USB, Type-C and HDMI support.",

    keywords: [
      "M100 BYOD",
      "M100 wireless conferencing system",
      "BYOD wireless presentation",
      "wireless conference system",
      "wireless screen sharing",
      "4K wireless presentation",
      "4 screen wireless display",
      "wireless conferencing equipment",
      "China wireless conferencing system"
    ]
  },

  status: "active"
},

{
  productName: "CHEVLEN DM80 Wired Digital Encrypted Conference System",

  slug: "chevlen-dm80-wired-digital-encrypted-conference-system",

  category: "Conference Systems",

  mainCategory: "Conference Device",

  subCategory: "Wired Digital Conference System",

  shortDescription:
    "Fully digital wired conference system with multiple speaking modes, intelligent camera tracking, up to 60 microphone units per central processor and expandable capacity up to 512 units.",

  description:
    "The CHEVLEN DM80 is a fully digital wired encrypted conference system designed for professional conference environments. Each central processor can connect up to 60 microphone units and provides 6 RJ45 ports and 3 DIN 8-core interfaces for stable data transmission. The system can be expanded to support up to 512 microphone units using extenders and supports up to 12 chairman microphones. It provides multiple conference speaking modes, independent audio level control, PC-based attendance and voting functions, intelligent video tracking and a 4-in-1-out SDI video matrix supporting four high-speed PTZ camera inputs.",

  images: [],

  features: [
    "Fully digital wired conference system",
    "Supports multiple conference speaking modes",
    "Up to 60 microphone units per central processor",
    "Expandable up to 512 microphone units with extenders",
    "Supports up to 12 chairman microphones",
    "6 RJ45 ports",
    "3 DIN 8-core interfaces",
    "One-touch flywheel operation",
    "User-friendly menu settings",
    "Independent volume adjustment for system output",
    "Independent MP3 playback volume adjustment",
    "Independent microphone and speaker level adjustment",
    "RS-485 communication interface",
    "RS-232 communication interface",
    "RS-232/RX interface",
    "2.0-inch TFT HD color display",
    "Front USB port for conference recording",
    "USB MP3 playback",
    "Rear USB sound card interface",
    "PC connectivity for electronic attendance",
    "Supports voting, elections and scoring through dedicated software",
    "Intelligent auto-tracking for video conferencing",
    "4-in-1-out SDI video matrix",
    "Supports up to 4 high-speed PTZ camera inputs",
    "Multiple PTZ camera protocol support",
    "Limited mode",
    "FIFO mode",
    "Open mode",
    "Chairman priority mode"
  ],

  specifications: [
    {
      label: "Model",
      value: "CHEVLEN DM80"
    },
    {
      label: "Product Type",
      value: "Wired Digital Encrypted Conference System Main Unit"
    },
    {
      label: "Microphone Capacity per Central Processor",
      value: "Up to 60 microphone units"
    },
    {
      label: "Expandable Microphone Capacity",
      value: "Up to 512 microphone units with extenders"
    },
    {
      label: "Maximum Chairman Microphones",
      value: "12"
    },
    {
      label: "RJ45 Ports",
      value: "6"
    },
    {
      label: "DIN Interfaces",
      value: "3 × DIN 8-core"
    },
    {
      label: "Display",
      value: "2.0-inch TFT HD color display"
    },
    {
      label: "Front USB",
      value: "Conference recording and MP3 playback via USB drive"
    },
    {
      label: "Rear USB",
      value: "USB sound card port for audio signal exchange with computer"
    },
    {
      label: "Video Matrix",
      value: "4-in-1-out SDI"
    },
    {
      label: "PTZ Camera Inputs",
      value: "4 high-speed PTZ camera inputs"
    },
    {
      label: "Supported PTZ Protocols",
      value: "Pelco_P, Pelco_D, VISCA_SONY, SAMSUNG"
    },
    {
      label: "Communication Interfaces",
      value: "RS-485, RS-232, RS-232/RX, RJ45"
    },
    {
      label: "Speaking Modes",
      value: "Limited, FIFO, Open, Chairman Priority"
    },
    {
      label: "Rated Voltage",
      value: "AC220V ±10%, 50Hz"
    },
    {
      label: "Frequency Response",
      value: "20Hz–20kHz"
    },
    {
      label: "Output Impedance - REC",
      value: "200Ω"
    },
    {
      label: "Output Impedance - LINE",
      value: "200Ω"
    },
    {
      label: "Output Impedance - BALANCE",
      value: "300Ω"
    },
    {
      label: "Output Impedance - UNBALANCE",
      value: "400Ω"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: "78dB (1kHz, THD 1%)"
    },
    {
      label: "Dimensions",
      value: "485 × 340 × 88mm"
    },
    {
      label: "Rack Size",
      value: "2U standard rack size"
    },
    {
      label: "Weight",
      value: "12.7kg"
    },

    {
      label: "Microphone Unit Models",
      value: "MIC9EIA Main Unit, MIC9EIB Representative Unit, MIC9IA Main Unit, MIC9IB Representative Unit"
    },
    {
      label: "Microphone Construction",
      value: "High-strength aluminum alloy with CNC precision machining"
    },
    {
      label: "Microphone Indicator",
      value: "Three-sector red LED indicator"
    },
    {
      label: "Microphone Cable",
      value: "Built-in 2.1m 8-core aluminum foil mesh shielded cable"
    },
    {
      label: "Microphone Cable Customization",
      value: "Customizable cable/network cable version available"
    },
    {
      label: "Microphone Type",
      value: "Capacitive"
    },
    {
      label: "Microphone Directivity",
      value: "Single-directional"
    },
    {
      label: "Microphone Frequency Response",
      value: "60Hz–14Hz"
    },
    {
      label: "Microphone Sensitivity",
      value: "-48 ± 2dB at 1kHz"
    },
    {
      label: "Microphone Input Voltage",
      value: "DC18V, powered by central processor"
    },
    {
      label: "Microphone Minimum Output Impedance",
      value: "1kΩ"
    },
    {
      label: "Microphone Signal-to-Noise Ratio",
      value: "68dB(A)"
    },
    {
      label: "Microphone Output Socket",
      value: "8-pin terminal block"
    }
  ],

  applications: [
    "Corporate conference rooms",
    "Boardrooms",
    "Government meeting rooms",
    "Professional conference halls",
    "Digital conference systems",
    "Video conferencing",
    "Meetings requiring electronic attendance",
    "Voting and election meetings",
    "Conference rooms with PTZ camera tracking"
  ],

  packageContents: [],

  customization: {
    available: true,
    details:
      "The microphone cable/network cable version is customizable."
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CHEVLEN DM80 Wired Digital Encrypted Conference System",

    heroSubtitle:
      "Professional fully digital wired conference system with expandable microphone capacity, multiple speaking modes and intelligent PTZ camera tracking.",

    keyBenefits: [
      "Up to 60 microphone units per central processor",
      "Expandable up to 512 microphone units",
      "Supports up to 12 chairman microphones",
      "4-in-1-out SDI video matrix",
      "Supports 4 high-speed PTZ camera inputs",
      "Intelligent video auto-tracking",
      "Multiple conference speaking modes",
      "Electronic attendance, voting and scoring support",
      "2.0-inch TFT HD color display",
      "USB conference recording and MP3 playback",
      "Professional 2U rack-mount form factor"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CHEVLEN DM80 Wired Digital Encrypted Conference System | IndoChinaBridge",

    metaDescription:
      "CHEVLEN DM80 digital wired conference system with up to 60 microphone units per processor, expandable to 512 units, PTZ camera tracking and SDI video matrix.",

    keywords: [
      "CHEVLEN DM80",
      "DM80 conference system",
      "wired digital conference system",
      "digital encrypted conference system",
      "wired conference system",
      "conference microphone system",
      "digital conference control unit",
      "PTZ conference system",
      "conference voting system",
      "China conference system"
    ]
  },

  status: "active"
},


{
  productName: "CHEVLEN WM60 Wireless Digital Encrypted Conference System",

  slug: "chevlen-wm60-wireless-digital-encrypted-conference-system",

  category: "Conference Systems",

  mainCategory: "Conference Device",

  subCategory: "Wireless Digital Conference System",

  shortDescription:
    "UHF-band digital wireless encrypted conference system with multiple speaking modes, 6 simultaneous speakers, automatic frequency scanning and video tracking support.",

  description:
    "The CHEVLEN WM60 is a UHF-band digital wireless conference system featuring full digital control and multiple speaking modes for secure, high-quality conferencing. It operates across a selectable 520–930MHz frequency range and supports up to 2,000 delegate-unit IDs with a maximum of 5 chairperson units and 6 simultaneous speakers. The system uses secure digital transmission with random unique IDs and telecom-grade encryption, while automatic frequency scanning and DQPSK dual-antenna true diversity reception help provide reliable wireless operation. The system is compatible with video tracking and central control systems and supports multiple meetings within the same coverage area.",

  images: [],

  features: [
    "UHF-band digital wireless conference system",
    "Full digital control",
    "Secure digital transmission",
    "Random unique ID",
    "Telecom-grade encryption",
    "Supports up to 2,000 delegate-unit IDs",
    "Supports maximum 5 chairperson units",
    "Supports 6 simultaneous speakers",
    "Optional dedicated host microphone",
    "Supports handheld, lavalier and headset host microphones",
    "Multiple speaking modes",
    "Rotation speaking mode",
    "Limited speaking mode",
    "Chairperson priority mode",
    "Quick-response mode",
    "8 adjustable frequency bands",
    "Automatic frequency scanning",
    "DQPSK dual-antenna true diversity reception",
    "Video tracking compatibility",
    "Supports up to 20 simultaneous meetings in the same coverage area",
    "One-knob menu control",
    "Customizable boot logo and conference icon",
    "Color TFT LCD display",
    "Built-in interference-resistant condenser microphone capsule",
    "Speaking time display",
    "High-capacity lithium battery in microphone units",
    "Dedicated microphone charger",
    "Battery level display",
    "Low-voltage warning",
    "Frequency channel and signal indicators",
    "Electronic volume adjustment",
    "One-touch cough mute function",
    "Chairman unit priority control",
    "Chairman can mute delegate units"
  ],

  specifications: [
    {
      label: "Model",
      value: "CHEVLEN WM60"
    },
    {
      label: "Product Type",
      value: "Wireless Digital Encrypted Conference System Main Unit"
    },
    {
      label: "Communication",
      value: "UHF digital wireless, bidirectional"
    },
    {
      label: "Communication Method",
      value: "Digital wireless, bidirectional"
    },
    {
      label: "Frequency Range",
      value: "Selectable 520–930MHz"
    },
    {
      label: "Channels",
      value: "6 channels (1 chairperson + 5 delegates)"
    },
    {
      label: "ID Capacity",
      value: "Up to 2,000 IDs"
    },
    {
      label: "Maximum Chairperson Units",
      value: "5"
    },
    {
      label: "Simultaneous Speakers",
      value: "6"
    },
    {
      label: "Demodulation",
      value: "FM"
    },
    {
      label: "Receiver Sensitivity",
      value: "-100dBm"
    },
    {
      label: "Indoor Coverage",
      value: "60m indoor radius"
    },
    {
      label: "Wireless Reception",
      value: "DQPSK dual-antenna true diversity reception"
    },
    {
      label: "Specified Diversity Reception Range",
      value: "120m indoor range"
    },
    {
      label: "Frequency Response",
      value: "20Hz–20kHz"
    },
    {
      label: "Audio Gain",
      value: "≤20dB"
    },
    {
      label: "Signal-to-Noise Ratio",
      value: ">85dB"
    },
    {
      label: "Total Harmonic Distortion",
      value: "≤0.8%"
    },
    {
      label: "Power Input",
      value: "DC 12V–15V, ≥1A"
    },
    {
      label: "Power Consumption",
      value: "<7W"
    },
    {
      label: "Operating Temperature",
      value: "-10°C to 40°C"
    },
    {
      label: "Microphone Coverage Range",
      value: "80m indoor radius"
    },
    {
      label: "Microphone Polar Pattern",
      value: "Cardioid (unidirectional)"
    },
    {
      label: "Microphone Frequency Response",
      value: "20Hz–20kHz (±3dB)"
    },
    {
      label: "High-Pass Filter",
      value: "80Hz, 18dB/octave"
    },
    {
      label: "Microphone On-Axis Sensitivity",
      value: "-40dB (10.0mV) relative to 1V at 1Pa"
    },
    {
      label: "Microphone Output Impedance",
      value: "250Ω"
    },
    {
      label: "Microphone Maximum SPL",
      value: "110dB SPL at 1kHz (1% THD)"
    },
    {
      label: "Microphone Dynamic Range",
      value: "102dB at 1kHz (maximum SPL)"
    },
    {
      label: "Microphone Signal-to-Noise Ratio",
      value: "62dB at 1kHz (1Pa)"
    },
    {
      label: "Microphone Power Supply",
      value: "3.7–5V DC"
    },
    {
      label: "Optimal Speaking Distance",
      value: "30–50cm"
    }
  ],

  applications: [
    "Corporate conference rooms",
    "Boardrooms",
    "Government meeting rooms",
    "Conference halls",
    "Wireless conference systems",
    "Video conferencing",
    "Meetings requiring encrypted wireless communication",
    "Multi-room conference environments",
    "Meetings with PTZ video tracking"
  ],

  packageContents: [],

  customization: {
    available: true,
    details:
      "The system supports customizable boot logos and conference icons. The microphone units also support dedicated configurations described in the product documentation."
  },

  sourcing: {
    country: "China",
    destination: "India",
    moq: ""
  },

  landingPage: {
    heroTitle: "CHEVLEN WM60 Wireless Digital Encrypted Conference System",

    heroSubtitle:
      "Secure UHF digital wireless conference solution with multi-channel speaking, automatic frequency management and video tracking support.",

    keyBenefits: [
      "520–930MHz selectable UHF frequency range",
      "Up to 2,000 delegate-unit IDs",
      "Up to 5 chairperson units",
      "6 simultaneous speakers",
      "Telecom-grade digital encryption",
      "8 adjustable frequency bands",
      "Automatic frequency scanning",
      "DQPSK dual-antenna true diversity reception",
      "Video tracking compatible",
      "Supports up to 20 simultaneous meetings",
      "Long battery operation for delegate units",
      "Chairperson priority and delegate mute control"
    ]
  },

  enquiry: {
    enabled: true,
    buttonText: "Request a Quote"
  },

  seo: {
    metaTitle:
      "CHEVLEN WM60 Wireless Digital Encrypted Conference System | IndoChinaBridge",

    metaDescription:
      "CHEVLEN WM60 UHF wireless digital encrypted conference system with up to 2,000 delegate IDs, 6 simultaneous speakers, automatic frequency scanning and video tracking support.",

    keywords: [
      "CHEVLEN WM60",
      "WM60 conference system",
      "wireless digital conference system",
      "wireless encrypted conference system",
      "UHF conference system",
      "digital wireless conference microphone",
      "wireless conference microphone system",
      "conference tracking system",
      "encrypted wireless conference system",
      "China wireless conference system"
    ]
  },

  status: "active"
}



]






const seedData = async () => {
  try {
    console.log("Starting data seeding...");

    // Clear existing data
    console.log("Clearing existing data...");
    await Product.deleteMany({});

    console.log("Existing data cleared");

    // Insert products
    console.log("Inserting products...");
    const insertedProducts = await Product.insertMany(products);
    console.log(`${insertedProducts.length} products seeded successfully`);

    console.log("Data seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});
