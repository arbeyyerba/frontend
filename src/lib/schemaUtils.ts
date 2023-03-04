import {
  DocumentType,
  isDocument,
  isDocumentArray,
  mongoose,
} from "@typegoose/typegoose";


export async function ensureDocumentArray<T>(
  query: any,
  errorMessageProducer?: () => string,
  debug?: boolean
): Promise<Array<DocumentType<T>>> {
  const queryResult = await query.catch((e: any) => console.log("uh oh, query error!", e));
  if (isDocumentArray(queryResult)) {
    return queryResult as unknown as Array<DocumentType<T>>;
  } else {
    if (debug) {
      console.log(
        "failed to get query result as a document array. instead got:",
        queryResult
      );
    }
    if (errorMessageProducer) {
      throw new Error(errorMessageProducer());
    } else {
      throw new Error(
        `Error fetching from database. expected document array, instead got ${queryResult}`
      );
    }
  }
}


export type MongoId = mongoose.Types.ObjectId | string;

export async function ensureDocument<T>(
  query: any,
  errorMessageProducer?: () => string,
  debug?: boolean
): Promise<DocumentType<T>> {
  const queryResult = await query;
  if (isDocument(queryResult)) {
    return queryResult;
  } else {
    if (debug) {
      console.log(
        "failed to get query result as a document. instead got:",
        queryResult
      );
    }
    if (errorMessageProducer) {
      throw new Error(errorMessageProducer());
    } else {
      throw new Error(
        `Error fetching from database. expected document, instead got ${queryResult}`
      );
    }
  }
}
