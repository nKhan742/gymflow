import { Schema, model } from 'mongoose';
import { IBaseModel, baseModelSchemaFields, baseSchemaOptions, StatusType } from '../../../../database/base.model.js';

export interface IFacilitiesModel extends IBaseModel {
  name: string;
  type: 'WEIGHT_ROOM' | 'CARDIO_ZONE' | 'STUDIO' | 'SWIMMING_POOL' | 'SAUNA' | 'LOCKER_ROOM';
  capacity: number;
  currentOccupancy: number;
  floor: string;
  amenities: string[];
  status: StatusType;
}

const facilitiesSchema = new Schema<IFacilitiesModel>(
  {
    ...(baseModelSchemaFields as any),
    name: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['WEIGHT_ROOM', 'CARDIO_ZONE', 'STUDIO', 'SWIMMING_POOL', 'SAUNA', 'LOCKER_ROOM'],
      default: 'WEIGHT_ROOM',
      index: true,
    },
    capacity: { type: Number, default: 50 },
    currentOccupancy: { type: Number, default: 0 },
    floor: { type: String, default: 'Ground Floor' },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived', 'draft', 'suspended'],
      default: 'active',
      index: true,
    },
  },
  baseSchemaOptions
);

export const FacilitiesModel = model<IFacilitiesModel>('Facilities', facilitiesSchema);

