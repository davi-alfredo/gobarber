import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointments from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parserDate = parseISO(date);

    // 2019-11-05 00:00:00
    // 2019-11-05 23:59:59
    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parserDate), endOfDay(parserDate)]
        }
      },
      order: ['date']
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
