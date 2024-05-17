import { PdfReader } from "pdfreader";

function addTextToLines(textLines, item) {
  const existingLine = textLines.find(({ y }) => y === item.y);
  if (existingLine) {
    existingLine.text += " " + item.text;
  } else {
    textLines.push(item);
  }
}

const parsePDF = async (buffer) =>
  new Promise((resolve, reject) => {
    const linesPerPage = [];
    let pageNumber = 0;
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) {
        resolve(linesPerPage.map((page) => page.map((line) => line.text)));
      } else if (item.page) {
        pageNumber = item.page - 1;
        linesPerPage[pageNumber] = [];
      } else if (item.text) {
        addTextToLines(linesPerPage[pageNumber], item);
      }
    });
  });

export default parsePDF;
