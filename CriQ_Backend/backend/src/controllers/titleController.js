const TitleService = require('../services/titleService');


exports.addTitle = async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ error: 'Image file is required' });
        // }
        const { title ,imageUrl} = req.body;
        const { sectionId } = req.params;

        
        const data = await TitleService.addTitle(sectionId, title, imageUrl);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTitles = async (req, res) => {
    try {
         const data = await TitleService.getAllTitles();
         res.status(200).json(data)
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
};

exports.getTitlesBySectonId = async (req, res) => {
   try {
        const { sectionId } = req.params;
        const data = await TitleService.getTitlesBySectonId(sectionId);
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json({ error: error.message });
   }
};

exports.getTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TitleService.getTitle(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateTitleById = async (req, res) => {
    try {
        const title = await TitleService.updateTitleById(req.params.titleId, req.body);        
        res.json({ message: "Title updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteTitleById = async (req, res) => {
    try {
        const title = await TitleService.deleteTitleById(req.params.titleId);        
        res.json(title);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
