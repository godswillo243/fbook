import { connectMonogDB } from "../config/mongodb";
import { PostModel } from "../models/post.model";
import { hashPassword } from "../lib/utils";

const images = [
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1753543601/cqky6nlwxua1fuzndg1f.png",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/cld-sample-5.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/cld-sample-2.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/cld-sample.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/cld-sample-4.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/cld-sample-3.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/samples/logo.png",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/samples/woman-on-a-football-field.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700286/samples/upscale-face-1.jpg",
  "https://res.cloudinary.com/djzmjvzxd/image/upload/v1749700285/samples/dessert-on-a-plate.jpg",
];

const authors = [
  "68814f147e115241f1675fd2",
  "6881517384e61517809e7cff",
  "6882c6ce52cfa42432592d31",
  "6882c6ce52cfa42432592d34",
  "6882c6ce52cfa42432592d37",
  "6882c6ce52cfa42432592d3a",
  "6882c6ce52cfa42432592d3d",
  "6882c6ce52cfa42432592d40",
  "6882cf28fb2785106f274894",
  "6882cf28fb2785106f274897",
  "6882cf28fb2785106f27489a",
  "6882cf28fb2785106f27489d",
  "6882cf28fb2785106f2748a0",
  "6882cf28fb2785106f2748a3",
];
const contents = [
  `Hello there i am a fullStack web developer looking for work`,
  `What did the idiot tell the other idiot?`,
  `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur sed quo veritatis repellendus expedita dolorem cupiditate earum, quam consectetur corporis consequuntur ea distinctio voluptatum laborum obcaecati incidunt, cumque veniam quos.`,
  `Ab, impedit velit magni cupiditate magnam officiis quasi esse non, asperiores ad libero saepe porro sequi. Soluta impedit suscipit consequuntur. Facilis, libero. Beatae natus laborum dignissimos omnis at? Mollitia aut distinctio consequatur eligendi optio sed error consectetur officiis, soluta quibusdam nulla maiores eum non nostrum tempore!`,
  `Aperiam, a totam ex corporis quasi culpa quaerat minima, alias aliquam molestias dignissimos nostrum.`,
  `Architecto debitis rem alias voluptatem velit vel aspernatur animi? `,
  `Maxime quasi molestiae non ut,
      omnis dolorum necessitatibus nihil? Placeat ad fuga ipsum similique sit
      corporis porro! Necessitatibus non at modi. Voluptates vero in expedita
      cum, distinctio repellendus voluptas corporis! `,
  `Mollitia cumque dicta excepturi? Assumenda necessitatibus amet
      rerum dolores sunt, veritatis est. Tenetur officiis eum laboriosam. Soluta
      excepturi explicabo itaque!`,
  `At, autem ea neque iste dicta recusandae, perferendis magni
      eaque repellat fugit praesentium omnis ad repellendus consequatur.`,
  `Odit aut nisi assumenda ratione, commodi necessitatibus dignissimos nostrum
      adipisci corporis praesentium`,
  `Perspiciatis facere nihil
      repudiandae nobis cumque ex non fugiat magnam`,
];
export async function seedPosts() {
  try {
    await connectMonogDB();

    const posts: {
      author: string;
      content: string;
      imageUrl: string;
    }[] = contents.map((content) => {
      const author = authors[Math.ceil(Math.random() * authors.length)];
      const imageUrl = images.shift() || "";

      return {
        author,
        content,
        imageUrl,
      };
    });

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      await PostModel.create(post);
    }
  } catch (error) {
    console.log(error);
  }
}

seedPosts()
  .then(() => process.exit(0))
  .then(() => console.log("Users seeded"));
