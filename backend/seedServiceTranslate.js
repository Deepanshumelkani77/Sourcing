const mongoose = require("mongoose");
const Service = require("./models/Service");
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

// Chinese translations for services
const chineseTranslations = {
  "supplier-identification": {
    phaseName: "采购",
    phaseTagline: "寻找并审核合适的制造商",
    serviceTitle: "供应商识别",
    serviceDescription: "找到符合您要求的合适制造商。",
    serviceDetails: "我们根据您的产品规格、数量、质量要求、目标价格和目的地识别合适的制造商。",
    included: [
      "制造商搜索",
      "能力匹配",
      "最小订货量比较",
      "价格比较",
      "初步供应商筛选"
    ],
    deliverable: "潜在供应商清单及相关的供应商信息供您评估。"
  },
  "supplier-evaluation": {
    phaseName: "采购",
    phaseTagline: "寻找并审核合适的制造商",
    serviceTitle: "供应商评估与验证",
    serviceDescription: "评估能力、经验、产能、价格和可靠性。",
    serviceDetails: "我们进行全面的供应商验证，包括工厂审核、能力评估、财务稳定性审查和质量体系评估。",
    included: [
      "工厂审核",
      "能力评估",
      "财务验证",
      "质量体系审查",
      "可靠性评估"
    ],
    deliverable: "详细的供应商评估报告，包含验证结果和建议。"
  },
  "sample-inspection": {
    phaseName: "样品",
    phaseTagline: "在承诺之前测试和批准",
    serviceTitle: "样品检验",
    serviceDescription: "在大规模生产前检验样品。",
    serviceDetails: "我们的质量专家在大规模生产开始前，根据您的规格、质量标准和技术要求检验生产样品。",
    included: [
      "外观检验",
      "尺寸验证",
      "材料测试",
      "功能测试",
      "文件审查"
    ],
    deliverable: "样品检验报告，包含详细发现和照片。"
  },
  "buyer-sample-approval": {
    phaseName: "样品",
    phaseTagline: "在承诺之前测试和批准",
    serviceTitle: "买方样品批准",
    serviceDescription: "将样品/证据发送给买方批准。",
    serviceDetails: "我们协调样品提交流程，提供检验证据，并通过全面的文件协助您的批准决策。",
    included: [
      "样品协调",
      "证据文件",
      "批准协助",
      "变更管理",
      "批准跟踪"
    ],
    deliverable: "样品批准文件，包含检验证据和状态。"
  },
  "order-placement": {
    phaseName: "订单与生产",
    phaseTagline: "锁定条款并跟踪每个里程碑",
    serviceTitle: "订单下达",
    serviceDescription: "与批准的供应商协调采购订单下达。",
    serviceDetails: "我们管理整个订单下达流程，包括采购订单准备、供应商确认和时间表建立。",
    included: [
      "采购订单准备",
      "供应商确认",
      "时间表建立",
      "条款谈判",
      "订单文件"
    ],
    deliverable: "确认的采购订单，包含商定的条款和交货时间表。"
  },
  "contract-documentation": {
    phaseName: "订单与生产",
    phaseTagline: "锁定条款并跟踪每个里程碑",
    serviceTitle: "合同与文件",
    serviceDescription: "协调合同、规格、商业条款和所需文件。",
    serviceDetails: "我们准备和管理所有必要的合同、规格、商业条款以及出口/进口文件。",
    included: [
      "合同准备",
      "规格文件",
      "商业条款",
      "出口文件",
      "进口文件"
    ],
    deliverable: "完整的合同和文件包，用于法律和运营用途。"
  },
  "production-monitoring": {
    phaseName: "订单与生产",
    phaseTagline: "锁定条款并跟踪每个里程碑",
    serviceTitle: "生产监控",
    serviceDescription: "跟踪生产进度并沟通更新。",
    serviceDetails: "我们在关键里程碑监控生产进度，进行定期状态检查，并就时间表遵守情况提供及时更新。",
    included: [
      "生产跟踪",
      "里程碑监控",
      "状态报告",
      "问题解决",
      "时间表管理"
    ],
    deliverable: "定期生产状态报告，包含里程碑进度和风险警报。"
  },
  "quality-inspection": {
    phaseName: "质量与交付",
    phaseTagline: "验证、发货和收货充满信心",
    serviceTitle: "质量检验",
    serviceDescription: "对照商定的规格和质量要求检查生产。",
    serviceDetails: "对照规格、质量标准和验收标准对成品进行全面质量检验。",
    included: [
      "质量检验",
      "规格验证",
      "缺陷检测",
      "合规检查",
      "检验报告"
    ],
    deliverable: "质量检验报告，包含缺陷分析和验收状态。"
  },
  "quantity-verification": {
    phaseName: "质量与交付",
    phaseTagline: "验证、发货和收货充满信心",
    serviceTitle: "数量验证",
    serviceDescription: "验证数量、包装数量和订单履行。",
    serviceDetails: "我们验证发货数量、包装数量、标签合规性和订单履行准确性。",
    included: [
      "数量清点",
      "包装验证",
      "标签检查",
      "履行验证",
      "文件检查"
    ],
    deliverable: "数量验证报告，包含包装和履行详情。"
  },
  "dispatch-coordination": {
    phaseName: "质量与交付",
    phaseTagline: "验证、发货和收货充满信心",
    serviceTitle: "发货协调",
    serviceDescription: "协调发货准备和货运交接。",
    serviceDetails: "我们协调发货准备、货运文件、承运人交接和货运跟踪启动。",
    included: [
      "发货准备",
      "货运文件",
      "承运人协调",
      "交接管理",
      "跟踪设置"
    ],
    deliverable: "发货确认，包含货运文件和跟踪信息。"
  },
  "local-transportation": {
    phaseName: "质量与交付",
    phaseTagline: "验证、发货和收货充满信心",
    serviceTitle: "本地运输",
    serviceDescription: "协调货物从供应商/工厂到仓库、集货点、港口等的移动。",
    serviceDetails: "我们管理内陆运输，包括从工厂提货、集货和交付到港口/仓库。",
    included: [
      "工厂提货",
      "集货",
      "内陆运输",
      "港口交付",
      "仓储协调"
    ],
    deliverable: "运输协调，包含跟踪和交付确认。"
  },
  "receiving-delivery": {
    phaseName: "质量与交付",
    phaseTagline: "验证、发货和收货充满信心",
    serviceTitle: "收货与交付",
    serviceDescription: "协调收货和最终交接。",
    serviceDetails: "我们协调最终收货、交付确认、文件交接和完成验证。",
    included: [
      "收货协调",
      "交付确认",
      "文件交接",
      "完成验证",
      "问题解决"
    ],
    deliverable: "交付确认，包含完整文件和完成报告。"
  }
};

// Seed translations
const seedTranslations = async () => {
  try {
    const services = await Service.find({});
    console.log(`Found ${services.length} services`);

    let updatedCount = 0;

    for (const service of services) {
      const translation = chineseTranslations[service.serviceId];
      
      if (translation) {
        const zhTranslation = {
          language: "zh",
          phaseName: translation.phaseName,
          phaseTagline: translation.phaseTagline,
          serviceTitle: translation.serviceTitle,
          serviceDescription: translation.serviceDescription,
          serviceDetails: translation.serviceDetails,
          included: translation.included,
          deliverable: translation.deliverable
        };

        // Check if translation already exists
        const existingTranslation = service.translations?.find(t => t.language === "zh");
        
        if (existingTranslation) {
          // Update existing translation
          Object.assign(existingTranslation, zhTranslation);
        } else {
          // Add new translation
          service.translations.push(zhTranslation);
        }

        await service.save();
        updatedCount++;
      }
    }

    console.log(`Updated translations for ${updatedCount} services`);
    console.log("Translations seeded successfully!");
  } catch (error) {
    console.error("Error seeding translations:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
const run = async () => {
  await connectDB();
  await seedTranslations();
};

run();
