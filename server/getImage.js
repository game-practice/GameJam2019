const images = ["slime", "money", "tesla"];

const synonyms = {
  slime: ["goo", "gooh"],
  money: ["cash", "green"],
  tesla: ["car", "electric car"]
};

function getImage() {
  const image = images[Math.floor(Math.random() * images.length)];
  return image;
}

function isSynonym(word, synonym) {
  return synonyms[word].includes(synonym);
}

module.exports = { getImage, isSynonym };
