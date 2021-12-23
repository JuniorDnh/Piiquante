const Sauce = require("../models/sauce"); 
const fs = require("fs"); 


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); 
  delete sauceObject._id; 
  const sauce = new Sauce({
    
    ...sauceObject, 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, 
  });
  sauce
    .save() 
    .then(() => res.status(201).json({ message: "Sauce créée!" })) 
    .catch((error) => res.status(400).json({ error })); 
};



exports.modifySauce = (req, res, next) => {
  if (req.file) {
   
    Sauce.findOne({ _id: req.params.id }) 
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1]; 
        fs.unlink(`images/${filename}`, () => {
          
          
          const sauceObject = {
            ...JSON.parse(req.body.sauce), 
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`, 
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          ) 
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    ) 
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; 
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) 
          .then(() => res.status(200).json({ message: "Sauce supprimée!" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) 
    .catch((error) => res.status(400).json({ error }));
};


exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => {
      switch (req.body.like) {
        case 1: 
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }
          ) 
            .then((sauce) => res.status(200).json({ message: "+1 !" }))
            .catch((error) => res.status(400).json({ error }));
          break;

        case 0: 
          if (sauce.usersLiked.includes(req.body.userId)) {
            
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
            ) 
              .then((sauce) => {
                res.status(200).json({ message: "Plus de vote !" });
              })
              .catch((error) => res.status(400).json({ error }));
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            ) 
              .then((sauce) => {
                res.status(200).json({ message: "Plus de vote !" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case -1: 
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: req.body.userId },
            }
          ) 
            .then((sauce) => res.status(200).json({ message: "-1 !" }))
            .catch((error) => res.status(400).json({ error }));
          break;
      }
    })
    .catch((error) => res.status(404).json({ error })); 
};
