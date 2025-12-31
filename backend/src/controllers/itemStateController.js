import Item from "../models/Item.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const archiveItem = asyncHandler(async(req,res) => {
    const item = await Item.findOneandUpdate(
        {_id : req.params.id , users: req.user.id},
        {isArchived :true},
        {new : true}
    );

    if(!item){
        res.status(400);
        throw new Error("Item not found");
    }

    res.json({message: "Item archived"})
})

export const restoreItem = asyncHandler(async(req,res) =>{
    const item = await Item.findOneAndUpdate(
        {_id : req.params.id , users : req.user.id},
        {isArchived: false},
        {new : true}
    );
    if(!item){
        res.status(404);
        throw new Error("Item not found ");
    }
    res.json({message : "Item restored"})
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isDeleted: true },
    { new: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  res.json({ message: "Item deleted" });
});