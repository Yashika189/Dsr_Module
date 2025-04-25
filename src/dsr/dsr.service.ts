import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dsr } from './dsr.model';
import { CreateDsrDto } from './dto/create-dsr.dto';
import { UpdateDsrDto } from './dto/update-dsr.dto';
import { Op } from 'sequelize';


@Injectable()
export class DsrService {
  constructor(@InjectModel(Dsr) private dsrModel: typeof Dsr) {}

  async create(userId: number, dto: CreateDsrDto) {
    return this.dsrModel.create({ ...dto, userId });
  }

  async update(userId: number, dto: UpdateDsrDto) {
    const today = new Date().toISOString().split('T')[0];

    const dsr = await this.dsrModel.findOne({
      where: {
        userId,
        createdAt: { [Op.gte]: new Date(`${today}T00:00:00.000Z`) },
      },
    });

    if (!dsr) throw new NotFoundException('No DSR for today found');
    return dsr.update(dto);
  }

  async getAll(userId: number, start?: string, end?: string, page = 1, limit = 10) {
    const where: any = { userId };

    if (start && end) {
      where.createdAt = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.dsrModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getById(userId: number, dsrId: number) {
    const dsr = await this.dsrModel.findOne({
      where: { id: dsrId, userId },
    });

    if (!dsr) throw new NotFoundException('DSR not found');
    return dsr;
  }
}
