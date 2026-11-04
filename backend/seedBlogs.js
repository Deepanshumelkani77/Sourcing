const mongoose = require("mongoose");
const Blog = require("./models/Blog");
const Admin = require("./models/Admin");
require("dotenv").config();

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get an admin to assign as author
    const admin = await Admin.findOne();
    if (!admin) {
      console.log("No admin found. Please create an admin first.");
      process.exit(1);
    }

    // Sample blogs data
    const blogs = [
      {
        title: "The Future of Global Sourcing: Trends to Watch in 2024",
        slug: "future-of-global-sourcing-2024",
        excerpt: "Explore the top trends shaping the global sourcing landscape in 2024, from AI-driven procurement to sustainable supply chains.",
        content: `
          <h2>Introduction</h2>
          <p>The global sourcing landscape is undergoing a significant transformation. As businesses adapt to new challenges and opportunities, several key trends are emerging that will shape the future of sourcing in 2024 and beyond.</p>

          <h2>AI-Driven Procurement</h2>
          <p>Artificial intelligence is revolutionizing how companies approach sourcing. From supplier selection to risk assessment, AI tools are enabling data-driven decisions that were previously impossible. Machine learning algorithms can now predict supply chain disruptions, optimize inventory levels, and identify cost-saving opportunities.</p>

          <h2>Sustainable Supply Chains</h2>
          <p>Sustainability is no longer just a buzzword—it's a business imperative. Companies are increasingly prioritizing suppliers who demonstrate strong environmental and social responsibility. This includes carbon footprint tracking, ethical labor practices, and circular economy principles.</p>

          <h2>Nearshoring and Regionalization</h2>
          <p>The pandemic highlighted the risks of over-reliance on distant suppliers. Many companies are now adopting nearshoring strategies, moving production closer to their primary markets. This trend is reducing lead times, improving responsiveness, and creating more resilient supply chains.</p>

          <h2>Digital Transformation</h2>
          <p>Digital platforms are making it easier than ever to connect with suppliers worldwide. From blockchain-based transparency to real-time tracking systems, technology is creating unprecedented visibility and control over global supply networks.</p>

          <h2>Conclusion</h2>
          <p>Staying ahead of these trends is crucial for businesses looking to maintain competitive advantage. By embracing innovation and adaptability, companies can build sourcing strategies that are both resilient and future-proof.</p>
        `,
        category: "Global Sourcing",
        tags: ["sourcing", "AI", "sustainability", "supply chain"],
        coverImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=600&fit=crop",
        coverImageAlt: "Global sourcing network visualization",
        thumbnailImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
        author: admin._id,
        status: "published",
        isFeatured: true,
        seoTitle: "Future of Global Sourcing 2024 - Key Trends",
        seoDescription: "Discover the top trends in global sourcing for 2024, including AI procurement, sustainable supply chains, and digital transformation.",
        focusKeyword: "global sourcing trends",
        readingTime: 5
      },
      {
        title: "Quality Control in Manufacturing: Best Practices",
        slug: "quality-control-manufacturing-best-practices",
        excerpt: "Learn essential quality control practices that ensure product excellence and customer satisfaction in manufacturing operations.",
        content: `
          <h2>The Importance of Quality Control</h2>
          <p>Quality control is the backbone of successful manufacturing operations. It ensures that products meet specifications, regulatory requirements, and customer expectations. In today's competitive market, quality is not just a differentiator—it's a necessity.</p>

          <h2>Implementing Quality Management Systems</h2>
          <p>A robust Quality Management System (QMS) provides the framework for consistent quality control. ISO 9001 certification is the gold standard, but the principles apply to any manufacturing operation. Key elements include documented procedures, regular audits, and continuous improvement processes.</p>

          <h2>Statistical Process Control</h2>
          <p>Statistical Process Control (SPC) uses statistical methods to monitor and control manufacturing processes. By tracking key metrics over time, manufacturers can identify trends, detect issues early, and make data-driven decisions to improve quality.</p>

          <h2>Supplier Quality Management</h2>
          <p>Quality control extends beyond your factory walls. Implementing strict supplier quality management programs ensures that raw materials and components meet your standards before they enter your production process.</p>

          <h2>Training and Culture</h2>
          <p>Quality is everyone's responsibility. Investing in employee training and fostering a quality-focused culture creates ownership and accountability at every level of the organization.</p>

          <h2>Conclusion</h2>
          <p>Effective quality control requires a comprehensive approach combining systems, processes, and people. By implementing these best practices, manufacturers can achieve consistent quality, reduce costs, and build customer trust.</p>
        `,
        category: "Quality Control",
        tags: ["quality control", "manufacturing", "ISO", "SPC"],
        coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
        coverImageAlt: "Quality inspection in manufacturing",
        thumbnailImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        author: admin._id,
        status: "published",
        isFeatured: false,
        seoTitle: "Quality Control Manufacturing Best Practices",
        seoDescription: "Essential quality control practices for manufacturing operations to ensure product excellence and customer satisfaction.",
        focusKeyword: "quality control manufacturing",
        readingTime: 4
      },
      {
        title: "Streamlining Logistics for Global Trade",
        slug: "streamlining-logistics-global-trade",
        excerpt: "Discover strategies to optimize logistics operations and improve efficiency in international trade and supply chain management.",
        content: `
          <h2>The Challenges of Global Logistics</h2>
          <p>Managing logistics across international borders presents unique challenges. From customs clearance to last-mile delivery, each step requires careful planning and execution. Complex regulations, varying infrastructure, and cultural differences add layers of complexity to global supply chains.</p>

          <h2>Technology-Driven Solutions</h2>
          <p>Modern logistics relies heavily on technology. Transportation Management Systems (TMS), Warehouse Management Systems (WMS), and advanced tracking platforms provide real-time visibility and control. These tools enable better decision-making and faster response to disruptions.</p>

          <h2>Optimizing Shipping Routes</h2>
          <p>Route optimization algorithms can significantly reduce costs and transit times. By analyzing factors such as fuel consumption, traffic patterns, and port congestion, companies can identify the most efficient shipping routes for their cargo.</p>

          <h2>Container Management</h2>
          <p>Effective container management is crucial for cost control. This includes optimizing container utilization, managing empty container repositioning, and implementing tracking systems to prevent loss and theft.</p>

          <h2>Building Strong Partnerships</h2>
          <p>Success in global logistics depends on strong partnerships with freight forwarders, customs brokers, and local carriers. These relationships provide the expertise and networks needed to navigate complex international requirements.</p>

          <h2>Conclusion</h2>
          <p>Streamlining logistics requires a holistic approach combining technology, strategy, and partnerships. By focusing on continuous improvement and innovation, companies can build logistics operations that support business growth and customer satisfaction.</p>
        `,
        category: "Logistics",
        tags: ["logistics", "shipping", "supply chain", "global trade"],
        coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",
        coverImageAlt: "Shipping containers at port",
        thumbnailImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
        author: admin._id,
        status: "published",
        isFeatured: true,
        seoTitle: "Streamlining Logistics Global Trade Strategies",
        seoDescription: "Strategies to optimize logistics operations and improve efficiency in international trade and supply chain management.",
        focusKeyword: "logistics optimization",
        readingTime: 5
      },
      {
        title: "Case Study: Successful Machinery Sourcing from China",
        slug: "case-study-machinery-sourcing-china",
        excerpt: "A detailed case study of how a manufacturing company successfully sourced high-quality machinery from China while managing risks and costs.",
        content: `
          <h2>The Challenge</h2>
          <p>A mid-sized manufacturing company needed to source specialized CNC machinery for a new production line. The challenge was to find high-quality equipment at competitive prices while managing the risks associated with international sourcing.</p>

          <h2>Initial Assessment</h2>
          <p>The company began by conducting a thorough needs assessment, documenting technical specifications, quality requirements, and budget constraints. This clarity was essential for effective supplier communication and evaluation.</p>

          <h2>Supplier Identification</h2>
          <p>Through industry networks, trade shows, and online platforms, the company identified 12 potential suppliers in China. Each was evaluated based on technical capability, quality certifications, financial stability, and customer references.</p>

          <h2>Due Diligence and Selection</h2>
          <p>After initial screening, three suppliers were selected for detailed evaluation. This included factory visits, sample testing, and reference checks. The final selection was based on a combination of technical capability, price, and cultural fit.</p>

          <h2>Contract Negotiation</h2>
          <p>The contract included detailed specifications, quality standards, delivery terms, and payment schedules. Legal experts ensured compliance with international trade regulations and protected the company's interests.</p>

          <h2>Quality Assurance</h2>
          <p>A comprehensive quality assurance program was implemented, including pre-shipment inspections, in-process quality checks, and final acceptance testing. Third-party inspectors provided objective verification of quality standards.</p>

          <h2>Results</h2>
          <p>The project was completed on time and within budget. The machinery met all quality specifications and has been operating reliably for over two years. The company saved 30% compared to domestic sourcing options.</p>

          <h2>Key Learnings</h2>
          <p>This case study demonstrates the importance of thorough preparation, careful supplier selection, and robust quality management in successful international sourcing. The relationships built during this project have proven valuable for subsequent sourcing initiatives.</p>
        `,
        category: "Case Studies",
        tags: ["case study", "machinery", "China", "sourcing"],
        coverImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=600&fit=crop",
        coverImageAlt: "CNC machinery in factory",
        thumbnailImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop",
        author: admin._id,
        status: "published",
        isFeatured: false,
        seoTitle: "Case Study Machinery Sourcing China",
        seoDescription: "Detailed case study of successful machinery sourcing from China with risk management and cost optimization strategies.",
        focusKeyword: "machinery sourcing China",
        readingTime: 6
      },
      {
        title: "Industry Insights: The Rise of Smart Manufacturing",
        slug: "industry-insights-smart-manufacturing",
        excerpt: "Explore how Industry 4.0 technologies are transforming manufacturing operations and creating new opportunities for efficiency and innovation.",
        content: `
          <h2>The Fourth Industrial Revolution</h2>
          <p>Industry 4.0 represents the convergence of digital technologies with traditional manufacturing. From IoT sensors to AI-powered analytics, smart manufacturing is reshaping how products are designed, produced, and delivered.</p>

          <h2>Internet of Things (IoT)</h2>
          <p>IoT devices are providing unprecedented visibility into manufacturing operations. Sensors on equipment collect real-time data on performance, maintenance needs, and quality metrics. This data enables predictive maintenance, reduces downtime, and improves overall equipment effectiveness.</p>

          <h2>Artificial Intelligence and Machine Learning</h2>
          <p>AI is transforming decision-making in manufacturing. Machine learning algorithms optimize production schedules, predict quality issues, and identify process improvements. Computer vision systems perform automated quality inspection with accuracy that exceeds human capabilities.</p>

          <h2>Robotics and Automation</h2>
          <p>Advanced robotics are taking on increasingly complex tasks. Collaborative robots (cobots) work alongside human operators, while autonomous mobile robots (AMRs) handle material transport. These technologies improve safety, consistency, and productivity.</p>

          <h2>Digital Twins</h2>
          <p>Digital twins create virtual replicas of physical assets and processes. These models enable simulation, optimization, and predictive analysis before changes are implemented in the real world, reducing risk and accelerating innovation.</p>

          <h2>Additive Manufacturing</h2>
          <p>3D printing is moving from prototyping to production. Additive manufacturing enables complex geometries, reduced material waste, and distributed production models that challenge traditional manufacturing paradigms.</p>

          <h2>Conclusion</h2>
          <p>Smart manufacturing is not just about technology—it's about reimagining how value is created. Companies that embrace these technologies and the cultural changes they require will be well-positioned for success in the evolving manufacturing landscape.</p>
        `,
        category: "Industry Insights",
        tags: ["Industry 4.0", "smart manufacturing", "IoT", "AI"],
        coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
        coverImageAlt: "Smart manufacturing with robots",
        thumbnailImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        author: admin._id,
        status: "published",
        isFeatured: true,
        seoTitle: "Industry Insights Smart Manufacturing Industry 4.0",
        seoDescription: "How Industry 4.0 technologies are transforming manufacturing with IoT, AI, robotics, and digital twins.",
        focusKeyword: "smart manufacturing",
        readingTime: 5
      }
    ];

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("Cleared existing blogs");

    // Insert new blogs
    const insertedBlogs = await Blog.insertMany(blogs);
    console.log(`Successfully inserted ${insertedBlogs.length} blogs`);

    console.log("\nSample blogs:");
    insertedBlogs.forEach(blog => {
      console.log(`- ${blog.title} (${blog.status})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();
