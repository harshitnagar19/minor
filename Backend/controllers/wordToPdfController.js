
const wordToPdfController = {};
wordToPdfController.convert = async (req, res) => {
    res.send({
        status:"ok"
    });
}

module.exports = wordToPdfController;