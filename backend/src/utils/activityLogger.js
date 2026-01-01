import Activity from "../models/Activity.js";

export const logActivity = async ({user, item, action , meta}) => {
    try {
        await Activity.create({
            user,
            item,
            action,
            meta
        });
    } catch(err) {
        console.error("Activity log failed " , err.message);
    }
};