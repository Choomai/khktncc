import { pool } from "$lib/db";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const [cats] = await pool.execute("SELECT * FROM categories ORDER BY title ASC");
    return { cats }
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const { session } = locals;
        const username = session.data.username;

        const docsFile = data.get("docs"),
            thumbnailImg = data.get("thumbnail"),
            docsName = data.get("name"),
            docsCat = data.get("category");
        let docsFilePath = null, thumbnailPath = null;
        const UUID = crypto.randomUUID();

        if (thumbnailImg instanceof File && thumbnailImg.type.startsWith("image/")) {
            const imgBuff = await thumbnailImg.arrayBuffer();
            thumbnailPath = path.join(
                process.cwd(),
                process.env.NODE_ENV == "production" ? "client" : "static",
                "docs", `${username}@${UUID}.webp`);
            await sharp(Buffer.from(imgBuff)).toFormat("webp").toFile(thumbnailPath);
            thumbnailPath = `/avatars/${username}@${UUID}.webp`;
        } else return { success: false, message: "Hình ảnh không hợp lệ" };

        if (docsFile instanceof File) {
            const docsBuff = await docsFile.arrayBuffer();
            const fileType = docsFile.name.split(".").pop();
            docsFilePath = path.join(
                process.cwd(),
                process.env.NODE_ENV == "production" ? "client" : "static",
                "docs", `${username}@${UUID}.${fileType}`
            );
            await writeFile(docsFilePath, Buffer.from(docsBuff));
            docsFilePath = `/docs/${username}@${UUID}.${fileType}`;
        } else return { success: false, message: "Tài liệu không hợp lệ" };

        const [rows] = await pool.execute("INSERT INTO docs(uuid, username, name, path, imgPath, category) VALUES(?, ?, ?, ?, ?)",
            [UUID, username, docsName, docsFilePath, thumbnailPath, docsCat]);
        if (rows.affectedRows == 0) return { success: false, message: "Có lỗi xảy ra khi upload tài liệu" };
        return { success: true, message: "Đăng tài liệu thành công", viewPath: docsFilePath };
    }
};