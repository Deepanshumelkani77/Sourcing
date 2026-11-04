const mongoose = require("mongoose");
const Blog = require("./models/Blog");
require("dotenv").config();

const testBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all blogs
    const allBlogs = await Blog.find({});
    console.log(`\nTotal blogs in database: ${allBlogs.length}`);

    if (allBlogs.length === 0) {
      console.log("\n⚠️  No blogs found in database!");
      console.log("Please run: npm run seed:blogs");
    } else {
      console.log("\n=== All Blogs ===");
      allBlogs.forEach((blog, index) => {
        console.log(`\n${index + 1}. ${blog.title}`);
        console.log(`   Status: ${blog.status}`);
        console.log(`   Category: ${blog.category}`);
        console.log(`   Featured: ${blog.isFeatured}`);
        console.log(`   Slug: ${blog.slug}`);
      });

      // Get published blogs
      const publishedBlogs = await Blog.find({ status: "published" });
      console.log(`\n\n=== Published Blogs ===`);
      console.log(`Total published: ${publishedBlogs.length}`);

      // Get featured blogs
      const featuredBlogs = await Blog.find({ status: "published", isFeatured: true });
      console.log(`\n=== Featured Blogs ===`);
      console.log(`Total featured: ${featuredBlogs.length}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testBlogs();
