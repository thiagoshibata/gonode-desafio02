const moment = require("moment");
const { Op } = require("sequelize");
const { Appointment, User } = require("../models");

class ScheduleController {
  async index(req, res) {
    const date = moment(parseInt(req.query.date));
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: "user" }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf("day").format(),
            date.endOf("day").format()
          ]
        }
      },
      order: ["date"]
    });

    const schedule = appointments.map(app => {
      return {
        name: app.user.name,
        avatar: app.user.avatar,
        date: moment(app.date).format("DD-MM-YYYY HH:mm")
      };
    });

    return res.render("schedule/index", { schedule });
  }
}

module.exports = new ScheduleController();
