import axios from "axios";
import { faker } from "@faker-js/faker";
import { questions } from "./questions";

const url =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSde14PaKYdZ7vjb1he5AEuo3IF3BiTFs3X1U6hpXLV-B3EO3A/formResponse";

const results = await Promise.allSettled(
  Array.from({ length: 1 }).map((_) => {
    const date = faker.date.recent({ days: 21 });
    console.log("Generated date is:", date);

    axios.post(
      url,
      {},
      {
        params: {
          partialResponse: JSON.stringify([
            questions.map((question) => {
              let answerArr: string[];

              if (typeof question.answer === "string") {
                answerArr = [question.answer];
              } else {
                answerArr = faker.helpers.arrayElements(question.answer, {
                  min: 1,
                  max: question.multiple ? question.answer.length : 1,
                });
              }

              return [null, question.entry, answerArr, 0];
            }),
            null,
            "-1697413505830492786",
          ]),
          pageHistory: "0,1,2,3",
          submissionTimestamp: date.getTime(),
        },
      }
    );
  })
);

const groupedByResults = Object.groupBy(results, (r) => r.status);

console.log(
  `${groupedByResults.fulfilled?.length} success response(s), ${
    groupedByResults.rejected?.length || 0
  } failed response(s).`
);
