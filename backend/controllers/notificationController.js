const Notification = require(
  "../models/Notification"
);

// Get My Notifications
exports.getNotifications =
  async (req, res) => {
    try {

      const notifications =
        await Notification.find({
          user: req.user.id,
        })
          .sort({
            createdAt: -1,
          });

      res.json(
        notifications
      );

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Mark As Read
exports.markAsRead =
  async (req, res) => {
    try {

      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            read: true,
          },
          {
            new: true,
          }
        );

      res.json(
        notification
      );

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };