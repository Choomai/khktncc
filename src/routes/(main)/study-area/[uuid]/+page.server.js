import { pool } from "$lib/db";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidv4Regex.test(params.uuid)) error(400, "Invalid UUID format");

    const [docs] = await pool.execute("SELECT * FROM docs WHERE uuid = ?", [params.uuid]);
    if (docs.length == 0) error(404, "Not found");
    return { docs };
}