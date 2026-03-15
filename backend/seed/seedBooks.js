const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "database", "library.db");
const db = new sqlite3.Database(dbPath);

const books = [
  {
    title: "The Lean Startup",
    description:
      "Guide to building startups using rapid experimentation and validated learning.",
    category: "Business",
    type: "Book",
    author: "Eric Ries",
    year: 2011,
    image: "/images/books/lean-startup.jpg",
    link: "https://flibusta.is/b/370498",
  },
  {
    title: "Atomic Habits",
    description:
      "Practical guide to building good habits and improving productivity.",
    category: "Business",
    type: "Book",
    author: "James Clear",
    year: 2018,
    image: "/images/books/atomic-habits.png",
    link: "https://flibusta.is/b/573185",
  },
  {
    title: "Clean Code",
    description:
      "A guide to writing readable, maintainable, and professional software.",
    category: "Computer Science",
    type: "Book",
    author: "Robert C. Martin",
    year: 2008,
    image: "/images/books/clean-code.webp",
    link: "https://www.litres.ru/book/robert-s-martin/chistyy-kod-sozdanie-analiz-i-refaktoring-pdf-epub-6444478/",
  },
  {
    title: "Introduction to Algorithms",
    description:
      "Comprehensive textbook covering algorithms, data structures, and complexity analysis.",
    category: "Computer Science",
    type: "Book",
    author: "Thomas H. Cormen",
    year: 2009,
    image: "/images/books/introduction-to-algorithms.avif",
    link: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    description:
      "Widely used textbook introducing artificial intelligence concepts and techniques.",
    category: "Computer Science",
    type: "Book",
    author: "Stuart Russell",
    year: 2020,
    image: "/images/books/ai-modern-approach.jpg",
    link: "https://aima.cs.berkeley.edu/",
  },
  {
    title: "Design Patterns",
    description:
      "Foundational book on reusable object-oriented software design patterns.",
    category: "Computer Science",
    type: "Book",
    author: "Erich Gamma",
    year: 1994,
    image: "/images/books/design-patterns.jpg",
    link: "https://openlibrary.org/works/OL45804W/Design_patterns",
  },
  {
    title: "The Pragmatic Programmer",
    description:
      "A guide to modern software engineering practices and programming philosophy.",
    category: "Computer Science",
    type: "Book",
    author: "Andrew Hunt",
    year: 1999,
    image: "/images/books/pragmatic-programmer.jpg",
    link: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
  },
  {
    title: "The War of the Worlds",
    description: "Story about a Martian invasion of Earth.",
    category: "Science Fiction",
    type: "Book",
    author: "H. G. Wells",
    year: 1898,
    image: "/images/books/war-of-the-worlds.jpg",
    link: "https://www.gutenberg.org/ebooks/36",
  },
  {
    title: "Engineering Mechanics: Dynamics",
    description:
      "Fundamental textbook on dynamics used in engineering programs.",
    category: "Engineering",
    type: "Book",
    author: "J. L. Meriam",
    year: 2017,
    image: "/images/books/engineering-mechanics.webp",
    link: "https://www.wiley.com/en-us/Engineering+Mechanics%3A+Dynamics%2C+9th+Edition-p-9781119390985",
  },
  {
    title: "The Design of Everyday Things",
    description:
      "Classic book on human-centered design and engineering usability.",
    category: "Engineering",
    type: "Book",
    author: "Don Norman",
    year: 2013,
    image: "/images/books/design-of-everyday-things.png",
    link: "https://jnd.org/the-design-of-everyday-things-revised-and-expanded-edition/",
  },
  {
    title: "Engineering Design: A Systematic Approach",
    description:
      "Framework for product development and engineering design processes.",
    category: "Engineering",
    type: "Book",
    author: "Gerhard Pahl",
    year: 2007,
    image: "/images/books/engineering-design.webp",
    link: "https://www.springer.com/gp/book/9781846283185",
  },
  {
    title: "How to Write a Thesis",
    description:
      "Classic academic guide to writing a thesis and research papers.",
    category: "Research",
    type: "Book",
    author: "Umberto Eco",
    year: 2015,
    image: "/images/books/how-to-write-thesis.avif",
    link: "https://mitpress.mit.edu/9780262527132/how-to-write-a-thesis/",
  },
  {
    title: "Pride and Prejudice",
    description:
      "Classic romantic novel about manners, upbringing and marriage in early 19th century England.",
    category: "Classic",
    type: "Book",
    author: "Jane Austen",
    year: 1813,
    image: "/images/books/Pride and Prejudice by Jane Austen.jpg",
    link: "https://www.gutenberg.org/ebooks/1342",
  },
  {
    title: "Alice's Adventures in Wonderland",
    description:
      "A fantasy story about a girl named Alice who falls through a rabbit hole into a magical world.",
    category: "Fantasy",
    type: "Book",
    author: "Lewis Carroll",
    year: 1865,
    image:
      "/images/books/Alice's Adventures in Wonderland by Lewis Carroll.jpg",
    link: "https://www.gutenberg.org/ebooks/11",
  },
  {
    title: "Frankenstein",
    description:
      "A Gothic science fiction novel about a scientist who creates a living being.",
    category: "Science Fiction",
    type: "Book",
    author: "Mary Shelley",
    year: 1818,
    image: "/images/books/Frankenstein.jpg",
    link: "https://www.gutenberg.org/ebooks/84",
  },
];

const createTableSql = `
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    type TEXT,
    author TEXT,
    year INTEGER,
    image TEXT,
    link TEXT
  )
`;

const insertSql = `
  INSERT INTO resources (title, description, category, type, author, year, image, link)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

db.serialize(() => {
  db.run(createTableSql, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      db.close();
      process.exit(1);
    }
    console.log("Table resources ready.");

    db.run("DELETE FROM resources", (err) => {
      if (err) {
        console.error("Error clearing table:", err);
        db.close();
        process.exit(1);
      }
      console.log("Cleared existing resources.");

      const stmt = db.prepare(insertSql);
      books.forEach((b) => {
        stmt.run(
          [
            b.title,
            b.description,
            b.category,
            b.type,
            b.author,
            b.year,
            b.image,
            b.link,
          ],
          (err) => {
            if (err) console.error("Error inserting:", b.title, err);
          },
        );
      });
      stmt.finalize((err) => {
        if (err) console.error(err);
        console.log(`Seeded ${books.length} books.`);
        db.close();
      });
    });
  });
});
