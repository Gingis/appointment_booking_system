import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { getPaginationParams } from '../utils/jwt';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { category, search, department } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;
    if (department) filter.department = { $regex: department, $options: 'i' };
    if (search) filter.name = { $regex: search, $options: 'i' };
    const [services, total] = await Promise.all([
      Service.find(filter).sort({ category: 1, name: 1 }).skip(skip).limit(limit),
      Service.countDocuments(filter),
    ]);
    res.json({ success: true, data: { services, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', error });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) { res.status(404).json({ success: false, message: 'Service not found' }); return; }
    res.json({ success: true, data: { service } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service', error });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: { service } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create service', error });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) { res.status(404).json({ success: false, message: 'Service not found' }); return; }
    res.json({ success: true, data: { service } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service', error });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) { res.status(404).json({ success: false, message: 'Service not found' }); return; }
    res.json({ success: true, message: 'Service deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    const departments = await Service.distinct('department', { isActive: true });
    res.json({ success: true, data: { categories, departments } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error });
  }
};
