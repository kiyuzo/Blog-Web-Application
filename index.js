import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let blogs = {
    blog1: {
        id: "blog1",
        title: "So i just found this new anime and ITS SO GOOD",
        content: "Holiday has come and i dont really know what to do in my free time, i can play video games but its not fun when you play alone. I decided to find something to watch, whether it is a series, movie, or anime. One anime caught my eye. It was blue box or Ao No Hako in Japanese. I decided to watch it and it was so good. It is a romance anime and i havent really watched romance anime in a while. I dont wanna spoil the story but the way the director made the story is so good. The artstyle is also really really good, i reccomend you to watch it. I actually want to forget about it so i can watch it again and feel the same way i felt when i first watched it. I hope you enjoy it as much as i do.",
        date: "2024-12-20",
        author: "Rama Pratama",
        tags: ["anime", "romance", "japanese"]
    },
    
    blog2: {
        id: "blog2",
        title: "I have reached 220 days streak on Duolingo Japanese",
        content: "Wow, 220 days on Duolingo for Japanese! It's been such an incredible journey—daily lessons, perfecting hiragana and katakana, tackling kanji, and mastering sentence structures. There were tough days when motivation wavered, but sticking to the streak made it all worth it. Now, I'm feeling so much more confident in my Japanese skills, ready to dive into conversations, explore Japanese culture, and take another step toward fluency. Here's to staying consistent and pushing even further! 🎉✨",
        date: "2024-12-19",
        author: "Rama Pratama",
        tags: ["japanese", "goal", "study"]
    }
}

const generateBlogId = () => {
    const existingIds = Object.keys(blogs).map(
        (key) => parseInt(key.replace("blog", ""))
    );
    const newId = Math.max(...existingIds) + 1;
    return `blog${newId}`;
}

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/blog", (req, res) => {
    res.render("blog.ejs", { blogs });
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    res.redirect("/contact");
});

app.get("/blog/new", (req, res) => {
    res.render("new.ejs");
  });

app.post("/blog/submit", (req, res) => {
    const { title, content, date, author, tags } = req.body;
  
    const newBlogId = generateBlogId();
    const parsedTags = tags.split(",").map((tag) => tag.trim());
  
    blogs[newBlogId] = {
      id: newBlogId,
      title,
      content,
      date,
      author,
      tags: parsedTags,
    };
  
    res.redirect("/blog");
  });

app.get("/blog/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const blog = blogs[blogId];
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.render("showBlog.ejs", { blog, blogId });
});  

app.get("/blog/edit/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    const blog = blogs[blogId];
    if (!blog) {
      res.status(404).send("blog not found");
      return;
    }
    res.render("edit.ejs", { blog, blogId });
  });

app.post("/blog/update/:blogId", (req, res) => {
  const { title, content, date, author, tags } = req.body;
  const blogId = req.params.blogId;

  if (!blogs[blogId]) {
    res.status(404).send("Blog not found");
    return;
  }

  blogs[blogId] = {
    ...blogs[blogId],
    title,
    content,
    date,
    author,
    tags: tags.split(",").map((tag) => tag.trim()),
  };

  res.redirect(`/blog/${blogId}`);
});

app.post("/blog/delete/:blogId", (req, res) => {
    const blogId = req.params.blogId;
    if (!blogs[blogId]) {
      res.status(404).send("Blog not found");
      return;
    }
  
    delete blogs[blogId];
    res.redirect("/blog");
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
