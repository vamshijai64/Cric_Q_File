const sectionService = require('../services/sectionService');


exports.addSection = async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ error: 'Image file is required' });
        // }
        const { title,imageUrl,images } = req.body;
     
        
        const data = await sectionService.addSection(title, imageUrl,images);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const sections = await sectionService.getAllSections();
        res.json(sections);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: error.message });
    }
};

exports.getSectionById = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const section = await sectionService.getSectionById(sectionId);
        res.status(200).json(section);      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getSectionWithTitles = async (req, res) => {
//     try {
//         const { sectionId } = req.params;
//         const section = await sectionService.getSectionWithTitles(sectionId);
//         res.status(200).json(section);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getAllSectionsWithTitles = async (req, res) => {
//     try {
//         const sectionsWithTitles = await sectionService.getAllSectionsWithTitles();
//         res.status(200).json(sectionsWithTitles);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.updateSectionById = async (req, res) => {
    try {
        const section = await sectionService.updateSectionById(req.params.sectionId, req.body);
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSectionById = async (req, res) => {
    try {
        const section = await sectionService.deleteSectionById(req.params.sectionId);
        res.json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
