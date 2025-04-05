module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ заборонено: лише для адміністраторів' });
    }
    next();
  };  