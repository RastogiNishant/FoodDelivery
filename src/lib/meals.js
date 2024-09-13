import { S3 } from "@aws-sdk/client-s3";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const s3 = new S3({
	region: "us-east-1",
});
const db = sql("meals.db");

export const getMeals = async () => {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return db.prepare("SELECT * FROM meals").all();
};

export const getMeal = (slug) =>
	db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);

export const saveMeal = async (meal) => {
	meal.slug = slugify(meal.title + "-" + Date.now(), { lower: true });
	meal.instructions = xss(meal.instructions);

	const extension = meal.image.name.split(".").pop();
	const fileName = `${meal.slug}.${extension}`;

	const bufferedImage = await meal.image.arrayBuffer();

	s3.putObject({
		Bucket: "nextjs-s3-bucket-13",
		Key: fileName,
		Body: Buffer.from(bufferedImage),
		ContentType: meal.image.type,
	});

	meal.image = fileName;

	db.prepare(
		`
	  INSERT INTO meals
		(title, summary, instructions, creator, creator_email, image, slug)
	  VALUES (
		@title,
		@summary,
		@instructions,
		@creator,
		@creator_email,
		@image,
		@slug
	  )
	`,
	).run(meal);
};
