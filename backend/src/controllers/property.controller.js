import { Property } from "../models/Property.js";

export async function createProperty(req, res) {
  try {
    const { name, address, rentAmount, type } = req.body;
    if (!name || !address || !rentAmount || !type)
      return res.status(400).json({ error: "Missing required fields" });

    const property = new Property({ name, address, rentAmount, type, tenants: [], userId: req.user.uid });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: "Failed to create property" });
  }
}

export async function getProperties(req, res) {
  try {
    const properties = await Property.find({ userId: req.user.uid }).populate({
      path: "tenants",
      select: "name contact rentDueDate",
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
}