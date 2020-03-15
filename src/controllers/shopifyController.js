const ShopifyController = {
  async getAll(req, res) {
    try {
      await res.status(200).json({ msg: 'Hello' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default ShopifyController;
