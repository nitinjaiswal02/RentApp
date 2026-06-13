import { Tenant } from "../models/Tenant.js";
import { Property } from "../models/Property.js";

export async function createTenant(req, res) {
  try {
    const { name, contact, propertyId, rentDueDate } = req.body;
    if (!name || !contact || !propertyId || !rentDueDate)
      return res.status(400).json({ error: "Missing required fields" });

    const property = await Property.findOne({ _id: propertyId, userId: req.user.uid });
    if (!property) return res.status(404).json({ error: "Property not found" });

    const tenant = new Tenant({
      name, contact, propertyId,
      rentDueDate: new Date(rentDueDate),
      payments: [],
      userId: req.user.uid,
    });
    await tenant.save();

    property.tenants.push(tenant._id);
    await property.save();

    res.status(201).json(tenant);
  } catch (err) {
    res.status(500).json({ error: "Failed to create tenant" });
  }
}

export async function getTenants(req, res) {
  try {
    const tenants = await Tenant.find({ userId: req.user.uid })
      .populate({ path: "propertyId", select: "name address rentAmount type" })
      .populate({ path: "payments", select: "amountPaid date" });

    const result = tenants.map((t) => ({
      _id: t._id,
      name: t.name,
      contact: t.contact,
      rentDueDate: t.rentDueDate,
      property: t.propertyId,
      payments: t.payments,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
}

export async function deleteTenant(req, res) {
  try {
    const tenant = await Tenant.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}