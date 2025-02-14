import { pool } from "$lib/db";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    const { session } = locals;
    const [teachers] = await pool.execute("SELECT * FROM users WHERE permission_level = 1 ORDER BY RAND() LIMIT 4");
    let stats = [null];
    if (session.data.permission_level >= 1) [stats] = await pool.execute(`
        SELECT
            COUNT(follows.follow_user_id) AS followers_count,
            (SELECT COUNT(articles.id) FROM articles) AS articles_count,
            (SELECT COUNT(exams.id) FROM exams) AS exams_count
        FROM follows
        WHERE follow_user_id = ?`.replace(/\s+/g, " ").trim(), [session.data.id]);
    
    return { teachers, stats: stats[0], session: session.data }
}