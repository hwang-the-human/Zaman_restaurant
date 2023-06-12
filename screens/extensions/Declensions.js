export default function declensions(word, number) {
  switch (true) {
    case number === 1:
      return number + " " + word;
    case number === 0 || (number >= 5 && number <= 20):
      return number + " " + word + "ов";
    case number >= 2 && number <= 4:
      return number + " " + word + "а";
    default:
      return "";
  }
}
