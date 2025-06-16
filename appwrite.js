import { Databases,Client, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm , movie) => {
    console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);
    //1. use the appwrite SDK to search if it already exists in the client
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])
        //2.If it does , update the client
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id , {
                count : doc.count +1,
            })  
        }
        //3.If it doesnt , create a new doc with searchTerm and count =1
        else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url :`https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })           
        }
    }
    catch(error) {
        console.log(error);
    }
}